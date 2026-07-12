import { executePlannerAgent } from './plannerAgent.js';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// Mock the LangChain Gemini module
jest.mock('@langchain/google-genai');

describe('Planner Agent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully parse a valid ticker with focus areas', async () => {
    // Mock the structured output chain response
    const mockResult = {
      ticker: 'TSLA',
      is_valid: true,
      focus_areas: ['battery tech'],
      error_message: null
    };

    const mockInvoke = jest.fn().mockResolvedValue(mockResult);
    const mockWithRetry = jest.fn().mockReturnValue({ invoke: mockInvoke });
    const mockWithStructuredOutput = jest.fn().mockReturnValue({ withRetry: mockWithRetry });

    ChatGoogleGenerativeAI.mockImplementation(() => ({
      withStructuredOutput: mockWithStructuredOutput
    }));

    const result = await executePlannerAgent('Research TSLA and look at their battery tech');
    
    expect(result).toEqual(mockResult);
    expect(mockInvoke).toHaveBeenCalledTimes(1);
  });

  it('should trigger fallback recovery on severe API error', async () => {
    // Mock a persistent API crash
    const mockInvoke = jest.fn().mockRejectedValue(new Error('Google API Timeout'));
    const mockWithRetry = jest.fn().mockReturnValue({ invoke: mockInvoke });
    const mockWithStructuredOutput = jest.fn().mockReturnValue({ withRetry: mockWithRetry });

    ChatGoogleGenerativeAI.mockImplementation(() => ({
      withStructuredOutput: mockWithStructuredOutput
    }));

    const result = await executePlannerAgent('AAPL');
    
    expect(result.is_valid).toBe(false);
    expect(result.error_message).toContain('System Error');
    expect(result.error_message).toContain('Google API Timeout');
  });
});
