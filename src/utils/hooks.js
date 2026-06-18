import { useState, useRef, useCallback } from 'react';

// Voice note hook
export function useVoiceNote(onResult) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Voice notes not supported in this browser. Try Safari on iPhone.');
      return;
    }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => { onResult(e.results[0][0].transcript); setListening(false); };
    rec.onerror  = () => setListening(false);
    rec.onend    = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }, [onResult]);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, start, stop };
}
