import { useState, useCallback } from 'react';
import { apiPost } from '../utils/api';

export function useChat() {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Halo! Ada yang bisa saya bantu terkait menu restoran kami hari ini?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    // Add user message to state
    const userMsg = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      // Send message to backend, including history (excluding the very first welcome message if we want, or just send all)
      const res = await apiPost('/api/chat', { 
        message: text,
        history: messages.slice(1) // skip the initial hardcoded welcome message for the API history
      });
      
      if (res.success && res.data && res.data.reply) {
        setMessages((prev) => [...prev, { role: 'model', text: res.data.reply }]);
      } else {
        throw new Error(res.message || 'Gagal mendapatkan respon AI');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message);
      setMessages((prev) => [...prev, { role: 'model', text: 'Maaf, saya sedang mengalami kendala. Silakan coba lagi nanti.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage
  };
}
