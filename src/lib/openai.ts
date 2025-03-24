import OpenAI from 'openai';

// Initialize OpenAI client with better build-time handling
let openai: OpenAI;

// More robust check for build time or missing API key
if (
  process.env.NEXT_PHASE === 'phase-production-build' || 
  process.env.NODE_ENV === 'test' ||
  !process.env.OPENAI_API_KEY
) {
  console.log('Using mock OpenAI client - no API key or build environment detected');
  // Mock client for build process with more complete interface
  openai = {
    chat: {
      completions: {
        create: async () => ({
          id: 'mock-id',
          choices: [{ message: { content: 'Mock response' } }],
          created: Date.now(),
          model: 'mock-model',
        }),
      },
    },
    embeddings: {
      create: async () => ({
        data: [{ embedding: new Array(1536).fill(0) }],
        model: 'mock-embedding-model',
      }),
    },
    // Add other OpenAI API methods you use
  } as unknown as OpenAI;
} else {
  // Normal initialization for runtime
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-mock-key',
  });
}

export default openai;

// Helper function to handle OpenAI API errors
export function handleOpenAIError(error: any): { message: string; status: number } {
  console.error('OpenAI API Error:', error);
  
  // Check for specific error types
  if (error.response) {
    // The API returned an error response
    return {
      message: `OpenAI API Error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`,
      status: error.response.status
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      message: 'No response received from OpenAI API',
      status: 503
    };
  } else {
    // Something happened in setting up the request
    return {
      message: error.message || 'An unexpected error occurred',
      status: 500
    };
  }
}