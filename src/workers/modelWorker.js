import axios from 'axios';

const API_URL = 'https://nodejs-serverless-function-express-eight-weld.vercel.app/api/chat'; // Your Vercel endpoint

// Handle messages from the main thread
const processMessage = async (message) => {
  const { input, prevMessages } = message.data;

  // Convert previous messages into the format expected by the API
  const messages = [
    ...prevMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
    {
      role: 'user',
      content: input,
    }
  ];

  try {

    // Send a request to Vercel API endpoint
    const response = await axios.post(
      API_URL,
      {
        messages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    postMessage({ result: response.data.result || "Sorry, I couldn't generate a response." });
  } catch (error) {
    console.error("Error calling Vercel API:", error);
    postMessage({ result: "Sorry, there was an error processing your request." });
  }
};

// Listen for incoming messages
onmessage = processMessage;