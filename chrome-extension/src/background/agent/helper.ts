import { type ProviderConfig, type ModelConfig, ProviderTypeEnum } from '@extension/storage';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatGroq } from '@langchain/groq';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';

const DEFAULT_TEMPERATURE = 0.1;
const DEFAULT_TOP_P = 0.1;

function getNumericParam(value: unknown, fallback: number): number {
  return typeof value === 'number' ? value : fallback;
}

export function createChatModel(providerConfig: ProviderConfig, modelConfig: ModelConfig): BaseChatModel {
  const temperature = getNumericParam(modelConfig.parameters?.temperature, DEFAULT_TEMPERATURE);
  const topP = getNumericParam(modelConfig.parameters?.topP, DEFAULT_TOP_P);

  switch (modelConfig.provider) {
    case ProviderTypeEnum.Gemini: {
      if (!providerConfig.apiKey) {
        throw new Error('Gemini providers require a valid API key.');
      }
      return new ChatGoogleGenerativeAI({
        model: modelConfig.modelName,
        apiKey: providerConfig.apiKey,
        temperature,
        topP,
      });
    }
    case ProviderTypeEnum.Groq: {
      if (!providerConfig.apiKey) {
        throw new Error('Groq providers require a valid API key.');
      }
      return new ChatGroq({
        model: modelConfig.modelName,
        apiKey: providerConfig.apiKey,
        temperature,
        topP,
      });
    }
    default:
      throw new Error(`Unsupported provider type: ${modelConfig.provider}`);
  }
}
