import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { FaCommentDots, FaPaperPlane, FaTimes } from 'react-icons/fa';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const newMessages = [...messages, { from: 'user', text: inputValue }];
    setMessages(newMessages);
    setInputValue('');

    // Simple auto-reply logic
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      setMessages([...newMessages, { from: 'bot', text: botResponse }]);
    }, 1000);
  };

  const getBotResponse = (userInput) => {
    const lowerCaseInput = userInput.toLowerCase();
    if (lowerCaseInput.includes('hello') || lowerCaseInput.includes('hi')) {
      return 'Hi there! How can I assist you?';
    }
    if (lowerCaseInput.includes('pricing') || lowerCaseInput.includes('cost')) {
      return 'You can find our pricing details on the pricing page.';
    }
    if (lowerCaseInput.includes('hours') || lowerCaseInput.includes('opening')) {
      return 'Our daycare is open from 8 AM to 6 PM, Monday to Friday.';
    }
    if (lowerCaseInput.includes('contact')) {
      return 'You can contact us at contact@daycare.com.';
    }
    return "I'm sorry, I don't understand. Can you please rephrase?";
  };

  return (
    <>
      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        {isOpen && (
          <Card className="chatbot-window">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Chat with us</span>
              <Button variant="link" onClick={toggleChat} className="p-0">
                <FaTimes />
              </Button>
            </Card.Header>
            <Card.Body className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.from}`}>
                  {msg.text}
                </div>
              ))}
            </Card.Body>
            <Card.Footer>
              <Form onSubmit={handleSendMessage} className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <Button variant="primary" type="submit" className="ms-2">
                  <FaPaperPlane />
                </Button>
              </Form>
            </Card.Footer>
          </Card>
        )}
      </div>
      <Button className="chatbot-toggler" onClick={toggleChat}>
        <FaCommentDots size={24} />
      </Button>
    </>
  );
};

export default Chatbot;