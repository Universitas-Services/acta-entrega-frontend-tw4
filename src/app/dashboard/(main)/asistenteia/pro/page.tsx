'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IoSend } from 'react-icons/io5';
import apiClient from '@/lib/axios';
import { useHeader } from '@/context/HeaderContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  text: string;
  isUser: boolean;
}

export default function AsistenteVirtualPage() {
  const { setTitle } = useHeader();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitle('Consultor IA');
    // Carga inicial desde localStorage
    try {
      const savedMessages = localStorage.getItem('chatMessages');
      const savedSessionId = localStorage.getItem('chatSessionId');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([
          {
            text: '¡Hola! Soy tu experto de actas de entregas. ¿En qué puedo ayudarte hoy?',
            isUser: false,
          },
        ]);
      }
      if (savedSessionId) setSessionId(savedSessionId);
    } catch (error) {
      console.error('No se pudo acceder a localStorage:', error);
      setMessages([
        {
          text: '¡Hola! Soy tu asistente de actas de entregas. ¿En qué puedo ayudarte hoy?',
          isUser: false,
        },
      ]);
    }
  }, [setTitle]);

  useEffect(() => {
    // Guardado en localStorage
    if (messages.length > 1)
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    if (sessionId) localStorage.setItem('chatSessionId', sessionId);
  }, [messages, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/ai/detectIntent', {
        message: input,
        sessionId: sessionId,
      });
      const botMessage: Message = {
        text: response.data.response,
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
      if (response.data.sessionId) setSessionId(response.data.sessionId);
    } catch {
      const errorMessage: Message = {
        text: 'Lo siento, hubo un error al conectar. Inténtalo de nuevo.',
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex justify-center">
      <div className="flex flex-col h-full w-full max-w-4xl bg-slate-50 border rounded-lg shadow-xl">
        <div className="flex items-center p-4 border-b bg-white rounded-t-lg">
          {/* ▼▼▼ 1. IMAGEN EN LA CABECERA ▼▼▼ */}
          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src="/ia/julioAI.jpg" alt="AsesorIA" />
            <AvatarFallback>IA</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold text-gray-800">
            Consultor IA - Actas de Entrega
          </h2>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-4',
                msg.isUser ? 'justify-end' : 'justify-start'
              )}
            >
              {!msg.isUser && (
                // ▼▼▼ 2. IMAGEN EN LOS MENSAJES DEL BOT ▼▼▼
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/ia/julioAI.jpg" alt="AsesorIA" />
                  <AvatarFallback className="bg-primary-blue text-white">
                    IA
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-md p-3 rounded-lg shadow-sm',
                  msg.isUser
                    ? 'bg-primary-blue text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none'
                )}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4 justify-start">
              {/* ▼▼▼ 3. IMAGEN EN EL INDICADOR "ESCRIBIENDO..." ▼▼▼ */}
              <Avatar className="h-8 w-8 animate-pulse">
                <AvatarImage src="/ia/julioAI.jpg" alt="AsesorIA" />
                <AvatarFallback className="bg-primary-blue text-white">
                  IA
                </AvatarFallback>
              </Avatar>
              <div className="max-w-md p-3 rounded-lg bg-white text-gray-800 rounded-bl-none shadow-sm">
                <p className="text-sm italic text-gray-500">Escribiendo...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-white rounded-b-lg">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-4"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-slate-100 focus-visible:ring-primary-blue"
              disabled={isLoading}
              autoComplete="off"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90 rounded-full w-10 h-10 p-2"
            >
              <IoSend className="text-white" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
