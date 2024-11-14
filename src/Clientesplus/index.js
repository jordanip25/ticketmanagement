import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 80%;
  margin: 10px auto;
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 10px;
  flex-direction: column;
`;

const ChatBubble = styled.div`
  background-color: #dcf8c6;
  padding: 10px;
  border-radius: 15px;
  margin: 5px 0;
  width: fit-content;
  max-width: 80%;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Select = styled.select`
  margin-bottom: 15px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 100%;
`;

const ResponseBubble = styled(ChatBubble)`
  background-color: #d1e7ff;
  align-self: flex-end;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  margin-top: 15px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Clientes = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('https://sandy-puddle-hydrangea.glitch.me/users');
        const data = await response.json();
        setClients(data.names);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const fetchMessages = async (query) => {
      if (!query) return;
      try {
        const response = await fetch('https://sandy-puddle-hydrangea.glitch.me/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query })
        });
  
        if (!response.ok) {
          throw new Error('No se encontraron resultados o hubo un error en el servidor');
        }
  
        const data = await response.json();
        setMessages(data);
  
      } catch (error) {
        setError(error.message);
        setMessages([]);
      }
    };

    fetchMessages(selectedClient);
  }, [selectedClient]);

  const handleClientChange = (e) => {
    setSelectedClient(e.target.value);
    setMessages([]);
    setResponse('');
  };

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleConcatenateAndSend = async () => {
    const concatenatedQueries = messages.map(msg => msg.consulta).join(' ');
    
    try {
      const response = await fetch('https://sandy-puddle-hydrangea.glitch.me/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ concatenatedQueries })
      });
      
      if (!response.ok) {
        throw new Error('Error en el servidor al procesar la solicitud');
      }

      const data = await response.json();
      setResponse(data.response); // Mostrar la respuesta en el contenedor derecho

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container>
      <Select onChange={handleClientChange} value={selectedClient}>
        <option value="">Seleccione un cliente</option>
        {clients.map((client, index) => (
          <option key={index} value={client}>
            {client}
          </option>
        ))}
      </Select>
      <MessageContainer>
        {messages.map((msg, index) => (
          <ChatBubble key={index}>
            <b>TICKET000{msg.id} - {formatFecha(msg.fecha)}</b>
            <br/>
            {msg.consulta}
            <br />
          </ChatBubble>
        ))}
        {response && (
          <ResponseBubble style={{ whiteSpace: 'pre-line', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
            {response}
          </ResponseBubble>
        )}
        <Button onClick={handleConcatenateAndSend}>Enviar consultas</Button>
      </MessageContainer>
    </Container>
  );
};

export default Clientes;
