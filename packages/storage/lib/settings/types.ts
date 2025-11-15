// Agent name, used to identify the agent in the settings
export enum AgentNameEnum {
  Planner = 'planner',
  Navigator = 'navigator',
}

// Provider type list includes historical values for backward compatibility. Runtime support is limited to Gemini + Groq.
export enum ProviderTypeEnum {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
  DeepSeek = 'deepseek',
  Gemini = 'gemini',
  Grok = 'grok',
  Ollama = 'ollama',
  AzureOpenAI = 'azure_openai',
  OpenRouter = 'openrouter',
  Groq = 'groq',
  Cerebras = 'cerebras',
  Llama = 'llama',
  CustomOpenAI = 'custom_openai',
}

export const SUPPORTED_PROVIDER_TYPES = [ProviderTypeEnum.Gemini, ProviderTypeEnum.Groq] as const;
export type SupportedProviderType = (typeof SUPPORTED_PROVIDER_TYPES)[number];

export function isSupportedProviderType(value: unknown): value is SupportedProviderType {
  if (typeof value !== 'string') {
    return false;
  }
  return SUPPORTED_PROVIDER_TYPES.includes(value as SupportedProviderType);
}

// Default supported models for each built-in provider
export const llmProviderModelNames: Record<SupportedProviderType, string[]> = {
  [ProviderTypeEnum.Gemini]: ['gemini-2.5-flash', 'gemini-2.5-pro'],
  [ProviderTypeEnum.Groq]: ['llama-3.3-70b-versatile'],
  // Custom OpenAI providers don't have predefined models as they are user-defined
};

// Default parameters for each agent per provider, for providers not specified, use OpenAI parameters
export const llmProviderParameters: Record<
  SupportedProviderType,
  Record<AgentNameEnum, { temperature: number; topP: number }>
> = {
  [ProviderTypeEnum.Gemini]: {
    [AgentNameEnum.Planner]: {
      temperature: 0.7,
      topP: 0.9,
    },
    [AgentNameEnum.Navigator]: {
      temperature: 0.3,
      topP: 0.85,
    },
  },
  [ProviderTypeEnum.Groq]: {
    [AgentNameEnum.Planner]: {
      temperature: 0.7,
      topP: 0.9,
    },
    [AgentNameEnum.Navigator]: {
      temperature: 0.3,
      topP: 0.85,
    },
  },
};
