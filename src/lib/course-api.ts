import axios from 'axios';

/**
 * Generates a course structure based on user inputs
 */
export async function generateCourse(formData: any, language: string, selectedLevel: string, paidMember: boolean) {
  try {
    const response = await axios.post('/api/generate-course', {
      ...formData,
      language,
      selectedLevel,
      paidMember
    });

    return response.data;
  } catch (error) {
    console.error('Error generating course:', error);
    throw error;
  }
}

/**
 * Generates content for a specific subtopic
 */
export async function generateSubtopicContent(
  mainTopic: string,
  subtopicTitle: string,
  contentType: string,
  educationLevel: string,
  language: string = "English",
  selectedLevel: string = "medium"
) {
  try {
    const response = await axios.post('/api/generate-content', {
      mainTopic,
      subtopicTitle,
      contentType,
      educationLevel,
      language,
      selectedLevel
    });

    return response.data;
  } catch (error) {
    console.error('Error generating subtopic content:', error);
    throw error;
  }
}

/**
 * Saves a course to the database
 */
export async function saveCourse(
  uid: string,
  email: string,
  content: any,
  type: string,
  mainTopic: string,
  language: string
) {
  try {
    const response = await axios.post('/api/course', {
      user: uid,
      email,
      content: JSON.stringify(content),
      type,
      mainTopic: mainTopic.toLowerCase(),
      language
    });

    return response.data;
  } catch (error) {
    console.error('Error saving course:', error);
    throw error;
  }
}