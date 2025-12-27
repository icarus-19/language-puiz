import React, { useState, useRef } from 'react';
import './AudioPlayer.css';

const AudioPlayer = ({ text, language = 'es-ES' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef(null);

  const speakText = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
      utteranceRef.current = utterance;
    } else {
      setIsSupported(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="audio-player unsupported">
        <p>Text-to-speech not supported in your browser</p>
      </div>
    );
  }

  return (
    <div className="audio-player">
      <button 
        className={`play-button ${isPlaying ? 'playing' : ''}`}
        onClick={speakText}
        aria-label={isPlaying ? "Stop audio" : "Play audio"}
      >
        {isPlaying ? '⏹️' : '🔊'}
      </button>
      <div className="audio-controls">
        <span className="audio-text">
          Listen: "{text.substring(0, 40)}..."
        </span>
        {isPlaying && (
          <button 
            className="stop-button"
            onClick={stopSpeaking}
            aria-label="Stop audio"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
