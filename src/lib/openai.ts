import OpenAI from 'openai';

// Initialize the OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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