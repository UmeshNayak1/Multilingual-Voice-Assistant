import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [language, setLanguage] = useState("fr");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setIsDarkMode(savedTheme === "dark");
  }, []);

  const handleTranslate = async (inputText = text) => {
    try {
      const response = await fetch(
        "https://multilingual-voice-assistant-7q1s.onrender.com/translate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: inputText, dest: language }),
        }
      );
      const data = await response.json();
      setTranslatedText(data.translated_text || data.error);
      speakText(data.translated_text);
    } catch {
      setTranslatedText("Error connecting to server");
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      setText(spokenText);
      speakText(spokenText);
      await handleTranslate(spokenText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Error during voice input. Please try again.");
    };
  };

  const speakText = (textToSpeak) => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language || "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (value) => {
    navigator.clipboard
      .writeText(value)
      .then(() => alert("Copied to clipboard!"))
      .catch(() => alert("Failed to copy!"));
  };

  const handleClearText = () => {
    setText("");
    setTranslatedText("");
  };

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  return (
    <div
      className={`App ${isDarkMode ? "dark" : "light"} ${
        isLoaded ? "loaded" : ""
      }`}
    >
      <div className="bg-gradient"></div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      <h1 className="app-title">🎙️ Multilingual Voice Assistant</h1>

      <textarea
        rows="4"
        placeholder="Enter or speak text to translate..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="button-group">
        <button onClick={handleVoiceInput}>🎤 Speak</button>
        <button onClick={() => speakText(text)}>🔊 Speak Text</button>
        <button onClick={() => copyToClipboard(text)}>📋 Copy</button>
        <button onClick={handleClearText}>🧹 Clear</button>
      </div>

      <div className="language-select">
        <label htmlFor="language">🌐 Translate To:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="fr">French 🇫🇷</option>
          <option value="es">Spanish 🇪🇸</option>
          <option value="de">German 🇩🇪</option>
          <option value="hi">Hindi 🇮🇳</option>
          <option value="zh-cn">Chinese 🇨🇳</option>
        </select>
        <button onClick={() => handleTranslate()}>🚀 Translate</button>
      </div>

      <div className="output-section">
        <label htmlFor="translatedText">📝 Translated Text</label>
        <textarea
          id="translatedText"
          rows="4"
          value={translatedText}
          readOnly
        />
      </div>

      {translatedText && (
        <div className="button-group fade-in">
          <button onClick={() => speakText(translatedText)}>
            🔊 Speak Translation
          </button>
          <button onClick={() => copyToClipboard(translatedText)}>
            📋 Copy Translation
          </button>
        </div>
      )}

      <footer>
        🌐 Built with ❤️ by <b>Umesh Nayak</b>
      </footer>
    </div>
  );
}

export default App;
