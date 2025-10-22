"use client";

import { useState, useRef, useEffect } from "react";
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css'; // Tema VS Dark

export default function AIChatPage() {
  const [messages,
    setMessages] = useState([]);
  const [inputMessage,
    setInputMessage] = useState("");
  const [apiKey,
    setApiKey] = useState("");
  const [isLoading,
    setIsLoading] = useState(false);
  const [showApiKeyForm,
    setShowApiKeyForm] = useState(true);
  const messagesEndRef = useRef(null);

  // Cargar API key y mensajes del localStorage al iniciar
  useEffect(() => {
    const savedApiKey = localStorage.getItem("groq_api_key");
    const savedMessages = localStorage.getItem("chat_messages");

    if (savedApiKey) {
      setApiKey(savedApiKey);
      setShowApiKeyForm(false);
    }

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  },
    []);

  // Guardar mensajes cuando cambien (máximo 30)
  useEffect(() => {
    if (messages.length > 0) {
      const recentMessages = messages.slice(-30);
      localStorage.setItem("chat_messages", JSON.stringify(recentMessages));
    }
  },
    [messages]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  },
    [messages]);

  // Función para procesar el markdown y detectar bloques de código
  const renderMessageContent = (content) => {
    const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Texto antes del código
      if (match.index > lastIndex) {
        parts.push(
          <div key={`text-${lastIndex}`} style={ { marginBottom: "1rem" }}>
            {content.slice(lastIndex, match.index)}
          </div>
        );
      }

      const language = match[1] || 'text';
      const code = match[2].trim();

      // Usar highlight.js para el syntax highlighting
      let highlightedCode = code;
      try {
        if (language && hljs.getLanguage(language)) {
          highlightedCode = hljs.highlight(code, {
            language
          }).value;
        } else {
          highlightedCode = hljs.highlightAuto(code).value;
        }
      } catch (error) {
        console.error("Error highlighting code:", error);
        highlightedCode = code;
      }

      parts.push(
        <div key={`code-${match.index}`} style={ { marginBottom: "1rem" }}>
          <div
            style={ {
              background: "#1e1e1e",
              color: "#d4d4d4",
              padding: "0.5rem 1rem",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              fontSize: "0.8rem",
              borderBottom: "1px solid #333",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
            <span>{language}</span>
            <button
              onClick={(event) => {
                navigator.clipboard.writeText(code);
                // Feedback visual simple
                const btn = event.target;
                const originalText = btn.textContent;
                btn.textContent = "✅ Copiado!";
                setTimeout(() => {
                  btn.textContent = originalText;
                }, 2000);
              }}
              style={ {
                background: "transparent",
                border: "none",
                color: "#d4d4d4",
                cursor: "pointer",
                fontSize: "0.8rem",
                padding: "0.25rem 0.5rem"
              }}>
              📋 Copiar
            </button>
          </div>
          <pre
            style={ {
              background: "#1e1e1e",
              color: "#d4d4d4",
              padding: "1rem",
              margin: 0,
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              fontSize: "0.9rem",
              overflowX: "auto",
              fontFamily: "'Fira Code', 'Monaco', 'Cascadia Code', monospace",
              lineHeight: "1.4"
            }}>
            <code
              dangerouslySetInnerHTML={ { __html: highlightedCode }}
              style={ { fontFamily: "inherit" }}
              />
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Texto después del último código
    if (lastIndex < content.length) {
      parts.push(
        <div key={`text-end`} style={ { marginBottom: "1rem" }}>
          {content.slice(lastIndex)}
        </div>
      );
    }

    return parts.length > 0 ? parts: content;
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("groq_api_key", apiKey);
      setShowApiKeyForm(false);
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem("groq_api_key");
    setApiKey("");
    setShowApiKeyForm(true);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chat_messages");
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      role: "user",
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{
            role: "system",
            content: "Eres un asistente útil y amigable. Responde de manera concisa y clara. Cuando incluyas código, usa bloques de código con markdown especificando el lenguaje. Por ejemplo: ```javascript\n// tu código aquí\n```"
          },
            ...messages.slice(-28).map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: "user",
              content: inputMessage
            }],
          temperature: 0.7,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        content: data.choices[0].message.content,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        content: "❌ Error al conectar con Groq. Verifica tu API key e intenta nuevamente.",
        role: "error",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={ {
        padding: "30px 20px",
        maxWidth: "1200px",
        margin: "0 auto",
        minHeight: "100vh"
      }}>

      {/* Header */}
      <div style={ { textAlign: "center", marginBottom: "3rem" }}>
        <h1
          className="gradient-text"
          style={ { fontSize: "2.5rem", margin: "0 0 1rem 0" }}>
          🤖 AI Chat
        </h1>
        <p style={ { color: "var(--muted)", fontSize: "1.1rem" }}>
          Chatea con IA usando Groq - Con syntax highlighting para código
        </p>
      </div>

      {/* API Key Form */}
      {showApiKeyForm && (
        <div className="card glass" style={ { marginBottom: "2rem" }}>
          <h2
            style={ {
              color: "var(--primary)",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
            🔑 Configura tu API Key de Groq
          </h2>

          <div style={ { display: "grid", gap: "1rem" }}>
            <div>
              <label
                style={ {
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text)",
                  fontWeight: "600"
                }}>
                API Key de Groq *
              </label>
              <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              style={ {
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--text)",
                fontSize: "1rem"
              }}
              />
            <small style={ { color: "var(--muted)", marginTop: "0.5rem", display: "block" }}>
              Obtén tu API key gratuita en{" "}
              <a
                href="https://console.groq.com"
                target="_blank"
                rel="noopener noreferrer"
                style={ { color: "var(--primary)" }}
                >
                Groq Console
              </a>
            </small>
          </div>

          <button
            className="btn btn-primary"
            onClick={saveApiKey}
            disabled={!apiKey.trim()}
            style={ { width: "100%" }}>
            💾 Guardar API Key
          </button>
        </div>
      </div>
    )}

    {/* Chat Container */}
    <div className="card glass" style={ { marginBottom: "2rem" }}>
      <div
        style={ {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem"
        }}>
        <h2
          style={ {
            color: "var(--primary)",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
          💬 Chat
        </h2>

        <div style={ { display: "flex", gap: "0.5rem" }}>
          <button
            className="btn btn-ghost"
            onClick={clearChat}
            disabled={messages.length === 0}>
            🗑️ Limpiar Chat
          </button>
          <button
            className="btn btn-ghost"
            onClick={clearApiKey}>
            🔄 Cambiar API Key
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        style={ {
          height: "500px",
          overflowY: "auto",
          padding: "1rem",
          background: "rgba(255, 255, 255, 0.02)",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          marginBottom: "1rem"
        }}>
        {messages.length === 0 ? (
          <div
            style={ {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "var(--muted)",
              textAlign: "center"
            }}>
            <div style={ { fontSize: "3rem", marginBottom: "1rem" }}>
              👋
            </div>
            <p>
              ¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte?
            </p>
            <small>Puedo ayudarte con código usando bloques ```javascript</small>
          </div>
        ): (
          <div style={ { display: "grid", gap: "1rem" }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={ {
                  padding: "1rem",
                  background: message.role === "user"
                  ? "rgba(0, 162, 255, 0.1)": message.role === "error"
                  ? "rgba(255, 94, 98, 0.1)": "rgba(8, 255, 200, 0.05)",
                  border: message.role === "user"
                  ? "1px solid var(--accent1)": message.role === "error"
                  ? "1px solid #ff5e62": "1px solid var(--primary)",
                  borderRadius: "12px",
                  marginLeft: message.role === "user" ? "2rem": "0",
                  marginRight: message.role === "user" ? "0": "2rem"
                }}>
                <div
                  style={ {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "0.5rem"
                  }}>
                  <div
                    style={ {
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                    <span
                      style={ {
                        background: message.role === "user"
                        ? "var(--accent1)": message.role === "error"
                        ? "#ff5e62": "var(--primary)",
                        color: "var(--bg)",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: "600"
                      }}>
                      {message.role === "user" ? "👤 Tú": message.role === "error" ? "❌ Error": "🤖 IA"}
                    </span>
                  </div>
                  <span
                    style={ {
                      color: "var(--muted)",
                      fontSize: "0.75rem"
                    }}>
                    {message.timestamp}
                  </span>
                </div>
                <div
                  style={ {
                    color: "var(--text)",
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap"
                  }}>
                  {message.role === "assistant" ? renderMessageContent(message.content): message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div
                style={ {
                  padding: "1rem",
                  background: "rgba(8, 255, 200, 0.05)",
                  border: "1px solid var(--primary)",
                  borderRadius: "12px",
                  marginRight: "2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem"
                }}>
                <div
                  style={ {
                    width: "20px",
                    height: "20px",
                    border: "2px solid var(--primary)",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }}></div>
                <span style={ { color: "var(--text)" }}>Pensando...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={ { display: "flex", gap: "0.5rem" }}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu mensaje aquí... (Enter para enviar, Shift+Enter para nueva línea)"
          disabled={isLoading || showApiKeyForm}
          rows={3}
          style={ {
            flex: 1,
            padding: "0.75rem",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--text)",
            fontSize: "1rem",
            resize: "vertical",
            fontFamily: "inherit"
          }}
          />
        <button
          className="btn btn-primary"
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading || showApiKeyForm}
          style={ { alignSelf: "flex-end", height: "fit-content" }}>
          {isLoading ? "⏳": "📤"}
        </button>
      </div>
    </div>

    {/* Info Card */}
    <div className="card glass">
      <h3
        style={ {
          color: "var(--primary)",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
        💡 Características del Chat
      </h3>
      <ul
        style={ {
          color: "var(--muted)",
          lineHeight: "1.8",
          paddingLeft: "1.5rem"
        }}>
        <li><strong>Syntax Highlighting</strong> con highlight.js</li>
        <li><strong>Tema VS Dark</strong> para mejor legibilidad</li>
        <li><strong>Copiar código</strong> con un click en cualquier bloque</li>
        <li><strong>Detección automática</strong> del lenguaje</li>
        <li>Soporte para: JavaScript, Python, Java, C++, HTML, CSS, y más</li>
        <li>Usa <code>```javascript</code> para obtener mejor formato</li>
        <li>Historial de últimos 30 mensajes preservado</li>
      </ul>
    </div>

    {/* CSS para la animación de loading */}
    <style jsx>
      {`
      @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
      }
      `}
    </style>
  </div>
);
}