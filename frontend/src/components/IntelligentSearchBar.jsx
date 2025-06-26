
import React, { useState } from 'react';
import { Form, Button, InputGroup, ListGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import '../styles/IntelligentSearchBar.css';

const IntelligentSearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim() === '') return;

    setIsLoading(true);
    // Placeholder for API call
    const response = await fetchMcpResponse(query);
    setResults(response);
    setIsLoading(false);
  };

  const fetchMcpResponse = async (query) => {
    try {
      const response = await fetch('/api/mcp/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (response.ok) {
        return [{ title: query, answer: data.answer }];
      } else {
        return [{ title: 'Error', answer: data.error || 'Something went wrong.' }];
      }
    } catch (error) {
      console.error('Error fetching MCP response:', error);
      return [{ title: 'Error', answer: 'Could not connect to the server.' }];
    }
  };

  return (
    <div className="intelligent-search-bar">
      <Form onSubmit={handleSearch}>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Ask a question or search..."
            value={query}
            onChange={handleInputChange}
          />
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : <FaSearch />}
          </Button>
        </InputGroup>
      </Form>
      {results.length > 0 && (
        <ListGroup className="search-results mt-3">
          {results.map((result, index) => (
            <ListGroup.Item key={index}>
              <h5>{result.title}</h5>
              <p>{result.answer}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default IntelligentSearchBar;
