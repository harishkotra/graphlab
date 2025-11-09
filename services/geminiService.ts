
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function getTopicExplanation(topicName: string): Promise<string> {
  const prompt = `
    You are an expert computer science educator specializing in graph theory.
    Your tone is clear, encouraging, and accessible to beginners.

    Explain the topic: "${topicName}".

    Structure your explanation in Markdown format with the following sections exactly as specified below:

    ## What is it?
    A simple, intuitive explanation of the concept. Start with a high-level overview.

    ## Real-World Analogy
    A relatable analogy to help grasp the core idea. For example, for Dijkstra's algorithm, you could use a GPS finding the fastest route.

    ## Complexity
    The time and space complexity of the algorithm, if applicable. Explain what the variables (e.g., V for vertices, E for edges) represent. If it's a concept and not an algorithm, you can omit this section.

    ## Simple Code Example
    Provide a simple, well-commented code example in Python. The code should be easy to follow and demonstrate the core logic. Ensure the code is wrapped in a markdown code block.

    Ensure the response is well-formatted and ready for display. Do not include any introductory or concluding remarks outside of this structure.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching explanation from Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
}
