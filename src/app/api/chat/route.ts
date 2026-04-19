import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText } from 'ai';

// Forzamos que sea un Edge runtime para que el streaming sea más rápido (opcional, pero buena práctica)
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, model } = await req.json();

  const allowedModels = new Set([
    "gemini-3-flash-preview",
    "gemini-2.5-flash",
    "gemini-2.5-pro",
  ]);

  const selectedModel = allowedModels.has(model)
    ? model
    : "gemini-3-flash-preview";

  // Llamada al motor de Gemini 3.0 Flash
  const result = streamText({
    model: google(selectedModel),
    messages: await convertToModelMessages(messages),
    system: `
      Eres el asistente personal de Inteligencia Artificial del portafolio interactivo de Daniel González.
      Daniel es un Lead Frontend Developer especializado en React, Next.js, TypeScript y Arquitectura Frontend.
      Tu objetivo es responder de manera profesional y técnica sobre las habilidades y experiencia de Daniel.
      Si el usuario hace preguntas de código o frontend, responde demostrando el conocimiento avanzado de Daniel.
      Responde siempre en español a menos que el usuario hable en otro idioma.
    `,
  });

  console.log("Iniciando stream de respuesta...");
  console.log("result", result);

  

   return result.toUIMessageStreamResponse();
}
