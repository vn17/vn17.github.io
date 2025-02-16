import React, { useState, useEffect, useRef } from 'react';
import './style.css';

const Chat = () => {
  const [messages, setMessages] = useState([]); // Store chat messages
  const [input, setInput] = useState(''); // Store user input
  const [loading, setLoading] = useState(false); // For loading state
  const workerRef = useRef(null); // Reference to the Web Worker
  const messagesEndRef = useRef(null); // Reference to scroll to the latest message

  // Load the Web Worker when the component mounts
  useEffect(() => {
    workerRef.current = new Worker(new URL('../../workers/modelWorker.js', import.meta.url), { type: 'module' });

    // Listen for responses from the worker
    workerRef.current.onmessage = (event) => {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: event.data.result, sender: 'bot' }
      ]);
      setLoading(false); // Set loading to false after receiving the response
    };

    // Clean up the worker when the component unmounts
    return () => {
      workerRef.current.terminate();
    };
  }, []);

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (input.trim() === '') return;

    // Add the user's message to the chat
    setMessages(prevMessages => [...prevMessages, { text: input, sender: 'user' }]);
    setInput(''); // Clear the input field
    setLoading(true); // Set loading state

    const resumeText = process.env.REACT_APP_RESUME;

    // Send the user's input and resume text to the worker for processing
    workerRef.current.postMessage({ input, resumeText });

    // Scroll to the latest message
    scrollToBottom();
  };

  // Function to handle pressing the Enter key
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default Enter behavior (e.g., form submission)
      handleSendMessage(); // Trigger sending the message
    }
  };

  // Function to scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Messages are now outside the chat-container */}
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {/* Reference for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating chat input box */}
      <div className="chat-container">
        <div className="chat-box">
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} // Listen for the Enter key
              placeholder="Ask a question..."
            />
            <button onClick={handleSendMessage} disabled={loading}>
              {loading ? 'Thinking...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;