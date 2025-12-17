import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('https://chat-app-server-jnf3.onrender.com/');

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('User' + Math.floor(Math.random() * 1000));
  const [connected, setConnected] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected!');
      setConnected(true);
      socket.emit('loadHistory');
    });

    socket.on('history', (history) => {
      console.log('📥 History:', history.length);
      setMessages(history || []);
    });

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.off('connect');
      socket.off('history');
      socket.off('message');
      socket.off('disconnect');
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && connected) {
      socket.emit('message', { user, message: message.trim() });
      setMessage('');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>💬 Real-time Chat</h1>
        <div className="status">
          <span className={connected ? 'connected' : 'disconnected'}>
            {connected ? '🟢 Online' : '🔴 Offline'}
          </span>
          <span>👤</span>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="user-input"
            maxLength={20}
          />
        </div>
      </header>

      {/* ШИРОКИЙ КОНТЕЙНЕР ЧАТА */}
      <div className="chat-container">
        {/* Контейнер со скроллом */}
        <div className="messages-wrapper" ref={messagesRef}>
          {messages.length === 0 ? (
            <div className="no-messages">Нет сообщений...</div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`message ${msg.user === user ? 'own' : ''}`}
              >
                <span className="message-text">{msg.message}</span>
                <small>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </small>
              </div>
            ))
          )}
        </div>

        {/* Форма ввода снизу */}
        <form onSubmit={sendMessage} className="message-form">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={connected ? 'Сообщение...' : 'Подключение...'}
            className="message-input"
            disabled={!connected}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!connected || !message.trim()}
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
