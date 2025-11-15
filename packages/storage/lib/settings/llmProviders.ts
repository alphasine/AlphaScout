import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';
import {
  type AgentNameEnum,
  llmProviderModelNames,
  llmProviderParameters,
  ProviderTypeEnum,
  SUPPORTED_PROVIDER_TYPES,
  type SupportedProviderType,
  isSupportedProviderType,
} from './types';

// Interface for a single provider configuration
export interface ProviderConfig {
  name?: string; // Display name in the options
  type?: ProviderTypeEnum; // Help to decide which LangChain ChatModel package to use
  apiKey: string; // Must be provided
  baseUrl?: string;
  modelNames?: string[];
  createdAt?: number;
  // Legacy Azure-specific fields (kept for backward compatibility with old data)
  azureDeploymentNames?: string[];
  azureApiVersion?: string;
}

// Interface for storing multiple LLM provider configurations
// The key is the provider id, which is the same as the provider type for built-in providers, but is custom for custom providers
export interface LLMKeyRecord {
  providers: Record<string, ProviderConfig>;
}

export type LLMProviderStorage = BaseStorage<LLMKeyRecord> & {
  setProvider: (providerId: string, config: ProviderConfig) => Promise<void>;
  getProvider: (providerId: string) => Promise<ProviderConfig | undefined>;
  removeProvider: (providerId: string) => Promise<void>;
  hasProvider: (providerId: string) => Promise<boolean>;
  getAllProviders: () => Promise<Record<string, ProviderConfig>>;
};

const SUPPORTED_PROVIDER_SET = new Set<SupportedProviderType>(SUPPORTED_PROVIDER_TYPES);
const DEFAULT_PROVIDER_TYPE: SupportedProviderType = ProviderTypeEnum.Gemini;

// Storage for LLM provider configurations
const storage = createStorage<LLMKeyRecord>(
  'llm-api-keys',
  { providers: {} },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

// Helper to determine provider type from provider id
export function getProviderTypeByProviderId(providerId: string): SupportedProviderType {
  return isSupportedProviderType(providerId) ? providerId : DEFAULT_PROVIDER_TYPE;
}

// Helper function to get display name from provider id
export function getDefaultDisplayNameFromProviderId(providerId: string): string {
  const normalizedProvider = getProviderTypeByProviderId(providerId);
  switch (normalizedProvider) {
    case ProviderTypeEnum.Gemini:
      return 'Gemini';
    case ProviderTypeEnum.Groq:
      return 'Groq';
    default:
      return 'Unsupported Provider';
  }
}

// Get default configuration for supported providers
export function getDefaultProviderConfig(providerId: string): ProviderConfig {
  const type = getProviderTypeByProviderId(providerId);
  return {
    apiKey: '',
    name: getDefaultDisplayNameFromProviderId(providerId),
    type,
    modelNames: [...(llmProviderModelNames[type] || [])],
    createdAt: Date.now(),
  };
}

export function getDefaultAgentModelParams(providerId: string, agentName: AgentNameEnum): Record<string, number> {
  if (isSupportedProviderType(providerId)) {
    return llmProviderParameters[providerId][agentName];
  }
  return {
    temperature: 0.1,
    topP: 0.1,
  };
}

// Helper function to ensure backward compatibility for provider configs
function ensureBackwardCompatibility(providerId: string, config: ProviderConfig): ProviderConfig {
  const updatedConfig: ProviderConfig = { ...config };

  if (!updatedConfig.name) {
    updatedConfig.name = getDefaultDisplayNameFromProviderId(providerId);
  }

  const normalizedType = isSupportedProviderType(updatedConfig.type)
    ? updatedConfig.type
    : getProviderTypeByProviderId(providerId);
  updatedConfig.type = normalizedType;

  // Preserve any explicitly configured modelNames; only fall back to defaults
  // when none are present. This allows the Options UI to add custom models
  // (e.g., new Gemini variants) and have them appear in the model dropdown.
  if (!updatedConfig.modelNames || updatedConfig.modelNames.length === 0) {
    updatedConfig.modelNames = [...(llmProviderModelNames[normalizedType] || [])];
  }

  if (!updatedConfig.createdAt) {
    updatedConfig.createdAt = Date.now();
  }

  return updatedConfig;
}

function normalizeProviderEntry(providerId: string, config: ProviderConfig): [string, ProviderConfig] | null {
  const providerType = isSupportedProviderType(config.type) ? config.type : getProviderTypeByProviderId(providerId);
  if (!isSupportedProviderType(providerType)) {
    return null;
  }

  return [providerId, ensureBackwardCompatibility(providerId, { ...config, type: providerType })];
}

async function normalizeProvidersRecord(): Promise<Record<string, ProviderConfig>> {
  const data = (await storage.get()) || { providers: {} };
  const normalizedEntries = Object.entries(data.providers)
    .map(([providerId, config]) => normalizeProviderEntry(providerId, config))
    .filter((entry): entry is [string, ProviderConfig] => entry !== null);

  const normalizedProviders = Object.fromEntries(normalizedEntries);

  // Persist cleanup if we removed unsupported providers
  if (normalizedEntries.length !== Object.keys(data.providers).length) {
    await storage.set({ providers: normalizedProviders });
  }

  return normalizedProviders;
}

export const llmProviderStore: LLMProviderStorage = {
  ...storage,
  async setProvider(providerId: string, config: ProviderConfig) {
    if (!providerId) {
      throw new Error('Provider id cannot be empty');
    }

    if (config.apiKey === undefined) {
      throw new Error('API key must be provided');
    }

    const providerType = isSupportedProviderType(config.type) ? config.type : getProviderTypeByProviderId(providerId);
    if (!SUPPORTED_PROVIDER_SET.has(providerType)) {
      throw new Error('Only Gemini and Groq providers are supported in this build.');
    }

    await storage.set(current => ({
      providers: {
        ...(current?.providers || {}),
        [providerId]: ensureBackwardCompatibility(providerId, { ...config, type: providerType }),
      },
    }));
  },
  async getProvider(providerId: string) {
    const providers = await this.getAllProviders();
    return providers[providerId];
  },
  async removeProvider(providerId: string) {
    await storage.set(current => {
      if (!current?.providers) {
        return current;
      }
      const nextProviders = { ...current.providers };
      delete nextProviders[providerId];
      return { providers: nextProviders };
    });
  },
  async hasProvider(providerId: string) {
    const provider = await this.getProvider(providerId);
    return !!provider;
  },
  async getAllProviders() {
    return await normalizeProvidersRecord();
  },
};
