import OpenAI from 'openai';

// Initialize OpenAI client with better build-time handling
let openai: OpenAI;

// During build time or when testing, use a placeholder client
if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
  console.log('Building application - using mock OpenAI client');
  // Mock client for build process
  openai = {
    chat: {
      completions: {
        create: async () => ({
          id: 'mock-id',
          choices: [{ message: { content: 'Build-time placeholder' } }],
          created: Date.now(),
          model: 'mock-model',
        }),
      },
    },
  } as unknown as OpenAI;
} else {
  // Normal initialization for runtime
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder-for-build-process',
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