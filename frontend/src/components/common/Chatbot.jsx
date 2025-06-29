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

  // Número de WhatsApp - REEMPLAZA ESTE NÚMERO CON EL TUYO
  const whatsappNumber = '923226954'; // Número actualizado
  
  const handleWhatsAppClick = () => {
    // Mensaje predeterminado para WhatsApp
    const message = encodeURIComponent('¡Hola! Necesito ayuda con Sirenah. ¿Podrían atenderme?');
    
    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappUrl, '_blank');
  };

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
      {/* Botón flotante de WhatsApp */}
      <button 
        className="chatbot-button whatsapp-button"
        onClick={handleWhatsAppClick}
        aria-label="Contactar por WhatsApp"
        title="¡Chatea con nosotros por WhatsApp!"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      </button>

      {/* Botón flotante del chatbot */}
      <button 
        className={`chatbot-button chat-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir chat de ayuda"
        title="Asistente virtual"
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
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot; 