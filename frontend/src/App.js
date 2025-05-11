import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [language, setLanguage] = useState('fr'); // Default: French
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Define the API_URL based on the environment (local or production)
  // const API_URL = 'https://multilingual-voice-assistant-7q1s.onrender.com';

  const handleTranslate = async (inputText = text) => {
    try {
      const response = await fetch(`https://multilingual-voice-assistant-7q1s.onrender.com/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, dest: language }),
      });

      const data = await response.json();
      setTranslatedText(data.translated_text || data.error);
      speakText(data.translated_text);
    } catch (error) {
      setTranslatedText('Error connecting to server');
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      setText(spokenText);
      speakText(spokenText); // Speak original text
      await handleTranslate(spokenText); // Translate and speak translation
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      alert('Error during voice input. Please try again.');
    };
  };

  const speakText = (textToSpeak) => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value)
      .then(() => alert('Copied to clipboard!'))
      .catch(() => alert('Failed to copy!'));
  };

  const handleClearText = () => {
    setText('');
    setTranslatedText('');
  };

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <button
        onClick={toggleTheme}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#1a73e8',
          color: 'white',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.3s ease, transform 0.1s ease',
        }}
      >
        {isDarkMode ? '🌒' : '🌒'}
      </button>

      <h1>🎙️ Multilingual Voice Assistant</h1>

      <textarea
        rows="4"
        cols="50"
        placeholder="Enter or speak text to translate"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />

      <button onClick={handleVoiceInput}>🎤 Speak</button>
      <button onClick={() => speakText(text)}>🔊 Speak Text</button>
      <button onClick={() => copyToClipboard(text)}>📋 Copy Text</button>
      <button onClick={handleClearText}>🧹 Clear Text</button>
      <br /><br />

      <label htmlFor="language">Select Language for Your Translation</label>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="fr">French 🇫🇷</option>
        <option value="es">Spanish 🇪🇸</option>
        <option value="de">German 🇩🇪</option>
        <option value="hi">Hindi 🇮🇳</option>
        <option value="zh-cn">Chinese 🇨🇳</option>
      </select>

      <button onClick={() => handleTranslate()}>🌐 Click to Translate</button><br></br>

      <label htmlFor="translatedText">Translated Text</label>
      <br />
      <textarea
        id="translatedText"
        rows="4"
        cols="50"
        value={translatedText}
        readOnly
        style={{ marginTop: '5px' }}
      />
      {translatedText && (
        <>
          <button onClick={() => speakText(translatedText)}>🔊 Speak Translation</button>
          <button onClick={() => copyToClipboard(translatedText)}>📋 Copy Translation</button>
        </>
      )}
    </div>
  );
}

export default App;
