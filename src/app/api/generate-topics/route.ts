import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, difficulty = "medium", count = 5 } = body;

    if (!subject) {
      return NextResponse.json(
        { success: false, message: "Subject is required" },
        { status: 400 }
      );
    }

    const prompt = `Generate ${count} educational topics for ${subject} at ${difficulty} difficulty level. 
    Return the response as a JSON array of objects, where each object has:
    - name: the topic name
    - description: a brief description of what the topic covers
    - subtopics: an array of 3-5 related subtopics
    
    Format the response exactly like this:
    {
      "topics": [
        {
          "name": "Topic Name",
          "description": "Brief description",
          "subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3"]
        }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert curriculum designer. Generate well-structured educational topics."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated");
    }

    // Parse and validate the response
    try {
      const cleanContent = content.replace(/```json\s*|\s*```/g, '').trim();
      const parsedContent = JSON.parse(cleanContent);
      
      return NextResponse.json({
        success: true,
        data: parsedContent
      });
    } catch (error) {
      console.error("Error parsing generated content:", error);
      return NextResponse.json(
        { success: false, message: "Failed to parse generated content" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate topics" },
      { status: 500 }
    );
  }
}