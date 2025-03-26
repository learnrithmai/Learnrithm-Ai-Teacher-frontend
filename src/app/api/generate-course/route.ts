import { ENV } from '@/types/envSchema';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const {
      course,
      subtopic,
      educationLevel,
      country,
      school,
      curriculum,
      learningMaterials,
      language = "English",
      selectedLevel = "medium",
      paidMember = false
    } = body;

    // Input validation
    if (!course || !subtopic || !educationLevel) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Determine topic count based on membership
    const topicCount = paidMember ? "7" : "4";

    // Build a prompt based on user selections
    const prompt = constructPrompt({
      course,
      subtopic,
      educationLevel,
      country,
      school,
      curriculum,
      learningMaterials,
      language,
      selectedLevel,
      topicCount
    });

    // Generate content using OpenAI - UPDATED to remove response_format
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an educational content creator specializing in generating structured learning materials. Always provide valid JSON according to the requested format. Only respond with JSON, nothing else."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3500,
      // Removed the response_format parameter as it may not be supported by your model
    });

    // Extract the generated content
    const generatedContent = completion.choices[0].message.content;

    // Parse the JSON from the response
    try {
      // Clean the response if it contains markdown formatting
      const cleanedContent = generatedContent?.replace(/```json\s+|\s+```|```/g, '').trim() || "{}";
      
      // Parse the JSON response
      const parsedJson = JSON.parse(cleanedContent);
      
      return NextResponse.json({
        success: true,
        data: parsedJson,
        mainTopic: course.toLowerCase(),
        type: determineContentType(learningMaterials),
        language: language,
        educationLevel: educationLevel,
        selectedLevel: selectedLevel
      });
      
    } catch (error) {
      console.error("Error parsing JSON from OpenAI response:", error);
      console.log("Raw response:", generatedContent);
      
      return NextResponse.json(
        { success: false, message: "Failed to parse generated content", error: String(error) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate course content", error: String(error) },
      { status: 500 }
    );
  }
}

function constructPrompt({
  course,
  subtopic,
  educationLevel,
  country,
  school,
  curriculum,
  language,
  selectedLevel,
  topicCount
}: {
  course: string;
  subtopic: string;
  educationLevel: string;
  country: string;
  school: string;
  curriculum: string;
  learningMaterials: { pdf: boolean; video: boolean; text: boolean };
  language: string;
  selectedLevel: string;
  topicCount: string;
}) {
  // Make the prompt even more explicit about the JSON format
  let prompt = `Generate a comprehensive and educational list of exactly ${topicCount} distinct topics for a course on ${course} at ${selectedLevel} difficulty level. `;
  
  // Add education level context
  if (educationLevel === "highSchool") {
    prompt += `The content should be appropriate for high school students, focusing on core concepts and applications. `;
  } else if (educationLevel === "kg12") {
    prompt += `The content should be simplified for K-12 students, with emphasis on fundamental concepts and engaging examples. `;
  } else if (educationLevel === "university") {
    prompt += `The content should be at university level, including advanced concepts and analytical thinking. `;
  } else if (educationLevel === "skill") {
    prompt += `The content should focus on practical skill development with clear steps and applications. `;
  }

  // Add school-specific information if present
  if (school && educationLevel !== "skill") {
    prompt += `Target audience is students at ${school} in ${country}. If possible, align content with this institution's typical curriculum. `;
  }

  // Add curriculum information if present
  if (curriculum) {
    prompt += `Content should align with ${curriculum} curriculum standards and learning objectives. `;
  }

  // Add subtopics requirement
  prompt += `The generated topics MUST include coverage of the following subtopics: ${subtopic}. `;
  
  // Add language requirement
  prompt += `All content should be in ${language}. `;
  
  // Request for subtopics
  prompt += `For each main topic, generate 2-4 relevant subtopics that break down the main concept into teachable components. `;
  
  // Specify output format more explicitly
  prompt += `You must respond ONLY with a valid JSON object in exactly the following structure without any additional text, explanations or markdown formatting:

{
  "${course.toLowerCase()}": [
    {
      "title": "Main Topic Title",
      "subtopics": [
        {
          "title": "Subtopic Title",
          "theory": "",
          "youtube": "",
          "image": "",
          "done": false
        }
      ]
    }
  ]
}

Ensure all topics and subtopics are educational, clearly explained, and appropriate for the specified education level. Leave "theory", "youtube", and "image" fields empty as these will be filled later. Do not include any text outside of the JSON structure.`;
  
  return prompt;
}

function determineContentType(learningMaterials: { pdf: boolean; video: boolean; text: boolean }) {
  if (learningMaterials.video) {
    return "Video & Text Course";
  } else if (learningMaterials.pdf) {
    return "PDF Course";
  } else {
    return "Text & Image Course";
  }
}