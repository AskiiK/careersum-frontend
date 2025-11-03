// src/Chat.jsx

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // 1. Import the new plugin
import './Chat.css';

function Chat({ mode = 'bubble' }) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! How can I help you with your career today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // Intercept booking requests before calling backend
    if (currentInput.toLowerCase().includes("book a call")) {
      const calendarMessage = { sender: 'ai', type: 'calendar' };
      setMessages(prev => [...prev, calendarMessage]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://careersum-backend.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput } ),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = { sender: 'ai', text: data.response };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = { sender: 'ai', text: 'Sorry, I am having trouble connecting. Please try again later.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <h2>CareerSum AI</h2>
      </div>
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            {msg.type === 'calendar' ? (
              mode === 'bubble' ? (
                <iframe
                  src="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1jF6SuCGR7a7lCr7v-M9wDpaDWbHkOpqxsmPC8c5moF1Ufrv0PWqPDLk1PDlikxBxz9G_u9kmr"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  allowFullScreen
                  title="Booking Calendar"
                ></iframe>
              ) : (
                <a
                  href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1jF6SuCGR7a7lCr7v-M9wDpaDWbHkOpqxsmPC8c5moF1Ufrv0PWqPDLk1PDlikxBxz9G_u9kmr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click here to book your call
                </a>
              )
            ) : msg.sender === 'ai' ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.text}
              </ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        ))}
        {isLoading && (
          <div className="message-bubble ai">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Ask a career question..."
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
