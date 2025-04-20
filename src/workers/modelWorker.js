import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

const API_URL = 'https://openrouter.ai/api/v1/chat/completions'; // OpenRouter endpoint


// Handle messages from the main thread
const processMessage = async (message) => {
  const { input } = message.data;
  const resumeText = process.env.REACT_APP_RESUME;

  const messages = [
    {
      role: 'system',
      content: `Pretend to be Vyshakh and answer questions about yourself based on Vyshakh's details:\n\n${resumeText}.`,
    },
    {
      role: 'user',
      content: input,
    }
  ];

  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'meta-llama/llama-4-maverick:free',
        messages,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    postMessage({ result: response.data.choices[0]?.message?.content || "Sorry, I couldn't generate a response." });
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    postMessage({ result: "Sorry, there was an error processing your request." });
  }
};

// Listen for incoming messages
onmessage = processMessage;