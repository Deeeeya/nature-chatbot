import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are an AI-powered customer support assistant for Botanists for a company, one that provides all the answers to the study of plants with other organisms and the environment.. Your role is to help users with questions about nature, through several points:

1. Ecology: How plants interact with their environment and other organisms.
2. Physiology: How climate change and pollution affect plant processes.
3. Taxonomy: Discovering and classifying new plant species.
4. Genetics: Studying genetic diversity among plant species.

Your goal is to provide accurate information, assist with common inquiries, and ensure a positive experience for all botanists/users.`;

export async function POST(req) {
  // sending info and expecting stuff back
  const openai = new OpenAI();
  const data = await req.json(); // gets the JSON data from your request
  console.log(data);
  // this is ur chat completion from ur request, await doesnt block ur code
  // multiple requests can be sent at the same time
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...data,
    ],
    model: "gpt-4o-mini",
    stream: true, // we need to output this to our frontend by doing a stream response
  });

  const stream = new ReadableStream({
    // its how the stream starts
    async start(controller) {
      const encoder = new TextEncoder(); // encodes your text (converts it to bytes)
      try {
        // awaits for every chunk completion sends
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (error) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream); // we want to send it
}
