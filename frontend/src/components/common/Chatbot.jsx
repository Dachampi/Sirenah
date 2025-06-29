import React, { useState, useRef, useEffect } from 'react';
import '../../styles/Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy el asistente virtual de Sirenah. ¿En qué puedo ayudarte hoy?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular respuesta del bot
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hola') || message.includes('buenos días') || message.includes('buenas')) {
      return "¡Hola! ¿En qué puedo ayudarte hoy? Puedo ayudarte con información sobre productos, pedidos, envíos y más.";
    }
    
    if (message.includes('producto') || message.includes('productos')) {
      return "Tenemos una amplia variedad de productos. Puedes ver nuestro catálogo completo en la sección 'Catálogo' del menú principal.";
    }
    
    if (message.includes('precio') || message.includes('costo')) {
      return "Los precios de nuestros productos están disponibles en el catálogo. Cada producto muestra su precio actualizado.";
    }
    
    if (message.includes('envío') || message.includes('entrega') || message.includes('delivery')) {
      return "Realizamos envíos a toda la ciudad. El tiempo de entrega es de 1-3 días hábiles. El costo del envío se calcula al momento de la compra. Y se enviarian por Shalom en los dias siguientes, comunicarse con 945678234";
    }
    
    if (message.includes('pedido') || message.includes('compra')) {
      return "Para realizar un pedido, primero debes agregar productos a tu carrito. Luego puedes proceder al pago desde la sección 'Carrito'.";
    }
    
    if (message.includes('pago') || message.includes('tarjeta') || message.includes('efectivo')) {
      return "Aceptamos pagos con tarjeta de crédito/débito y efectivo. Los pagos con tarjeta se procesan de forma segura.";
    }
    
    if (message.includes('devolución') || message.includes('cambio')) {
      return "Aceptamos devoluciones dentro de los 30 días posteriores a la compra, siempre que el producto esté en su empaque original.";
    }
    
    if (message.includes('contacto') || message.includes('teléfono') || message.includes('email')) {
      return "Puedes contactarnos a través de la sección 'Contacto' en nuestro sitio web, o llamarnos al número que aparece allí.";
    }
    
    if (message.includes('horario') || message.includes('atención')) {
      return "Nuestro horario de atención es de lunes a viernes de 9:00 AM a 6:00 PM, y sábados de 9:00 AM a 2:00 PM.";
    }
    
    if (message.includes('carrito') || message.includes('carro')) {
      return "Para agregar productos a tu carrito, simplemente haz clic en el botón 'Agregar al carrito' en cualquier producto del catálogo.";
    }
    
    if (message.includes('cuenta') || message.includes('registro') || message.includes('login')) {
      return "Puedes crear una cuenta o iniciar sesión desde la sección 'Login' en la parte superior de la página.";
    }
    
    if (message.includes('ayuda') || message.includes('soporte')) {
      return "Estoy aquí para ayudarte. Si necesitas asistencia más específica, puedes contactar a nuestro equipo de soporte.";
    }
    
    return "Gracias por tu mensaje. Si necesitas ayuda específica, puedes contactar a nuestro equipo de atención al cliente a través de la sección 'Contacto'.";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Botón flotante */}
      <button 
        className={`chatbot-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir chat de ayuda"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Ventana del chat */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Asistente Virtual</h3>
            <p>¿En qué puedo ayudarte?</p>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  {message.text}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            
            {/* Indicador de escritura */}
            {isTyping && (
              <div className="message bot-message">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              maxLength={500}
              disabled={isTyping}
            />
            <button 
              onClick={handleSendMessage}
              disabled={inputMessage.trim() === '' || isTyping}
              className="send-button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot; 
