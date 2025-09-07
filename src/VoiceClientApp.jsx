import React, { useState, useEffect } from "react";

export default function App() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translated, setTranslated] = useState("");
  const [sourceLang, setSourceLang] = useState("en");

  let recognition;

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition API not supported in this browser.");
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = sourceLang;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      translateText(spokenText, sourceLang);
    };

    recognition.onend = () => setListening(false);

    window.startListening = () => {
      setListening(true);
      recognition.start();
    };

    window.stopListening = () => {
      recognition.stop();
    };
  }, [sourceLang]);

  const translateText = async (text, lang) => {
    try {
      const res = await fetch("http://localhost:5000/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sourceLang: lang }),
      });

      const data = await res.json();
      setTranslated(data.translated || "");
    } catch (err) {
      console.error("Translation error:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Voice to English Translator</h2>

      <div style={{ marginBottom: 10 }}>
        <label>
          Select Language:
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            style={{ marginLeft: 10 }}
          >
            <option value="en">English</option>
            <option value="ur">Urdu</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ar">Arabic</option>
          </select>
        </label>
      </div>

      <button onClick={() => window.startListening()} disabled={listening}>
        {listening ? "Listening..." : "Start Listening"}
      </button>

      <div style={{ marginTop: 20 }}>
        <h3>Original:</h3>
        <textarea value={transcript} readOnly rows={3} style={{ width: "100%" }} />

        <h3>English Translation:</h3>
        <textarea value={translated} readOnly rows={3} style={{ width: "100%" }} />
      </div>
    </div>
  );
}
