import { pipeline } from "@huggingface/transformers";

// Create a reference to the model
let textGenModelRef = null;

// Function to load the model when the worker starts
const loadModel = async () => {
  if (!textGenModelRef) {
    textGenModelRef = await pipeline("text2text-generation", "Xenova/LaMini-Flan-T5-783M");
  }
};

// Handle messages from the main thread
const processMessage = async (message) => {
  const { input, resumeText } = message.data;
  await loadModel(); // Load the model if it's not loaded yet

  const prompt = `You are given my resume: "${resumeText}". Answer the question: "${input}". Always respond in first person (using 'I'). If the user posts a greeting like hi or hello, respond with a nice greeting.`;
  const result = await textGenModelRef(prompt, { max_length: 150 });

  // Send the result back to the main thread
  postMessage({ result: result[0]?.generated_text || "I'm sorry, I couldn't answer that." });
};

// Listen for incoming messages
onmessage = processMessage;