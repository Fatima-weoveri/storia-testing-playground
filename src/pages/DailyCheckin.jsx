import { useState } from "react";

const API_BASE = "https://storia-ai-docker-image-bkavgfk3ha-od.a.run.app";

const DailyCheckin = ({ onNavigateHome }) => {
  const [question, setQuestion] = useState(
    "Welcome Fatima, how are you feeling?"
  );
  const [answer, setAnswer] = useState(
    "I'm feeling tired today. I spent most of the night playing games with a friend, which was actually a lot of fun and really refreshing socially. At the same time, the lack of sleep is catching up with me now, so I feel a bit low on energy and slower than usual."
  );
  const [conversationHistory, setConversationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic required-field validation
    if (!question.trim() || !answer.trim()) {
      setError("Please fill in both Question and Answer.");
      return;
    }

    // Store current question and answer before API call
    const currentQuestion = question.trim();
    const currentAnswer = answer.trim();

    setLoading(true);
    setError("");

    // Build historical entries from conversation history
    // const historical_entries = conversationHistory.map((entry) => ({
    //   question: entry.question,
    //   answer: entry.answer,
    // }));

    const payload = {
      question: currentQuestion,
      answer: currentAnswer,
      //   historical_entries,
    };

    try {
      const res = await fetch(
        `${API_BASE}/storia/generateFollowUpQuestionNew/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text}`);
      }

      const data = await res.json();
      console.log(data);

      // Add current question-answer to conversation history
      const newEntry = {
        question: currentQuestion,
        answer: currentAnswer,
        timestamp: new Date().toLocaleString(),
      };
      setConversationHistory((prev) => [...prev, newEntry]);

      // Set the follow-up question in the question field
      if (data.follow_up_question) {
        setQuestion(data.follow_up_question);
      } else {
        setQuestion("");
      }

      // Clear answer field for next response
      setAnswer("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: "20px auto", padding: "0 20px" }}>
      {onNavigateHome && (
        <button
          onClick={onNavigateHome}
          style={{
            marginBottom: "20px",
            padding: "8px 16px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>
      )}
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Daily Check-in API Playground
      </h2>
      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        <div style={{ width: "30%", minWidth: 0 }}>
          <form
            onSubmit={handleSubmit}
            style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}
          >
            <div style={{ marginBottom: 8 }}>
              <label>Question</label>
              <textarea
                style={{ width: "100%" }}
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Answer</label>
              <textarea
                style={{ width: "100%" }}
                rows={6}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !question.trim() || !answer.trim()}
            >
              {loading ? "Generating..." : "Generate Next Question"}
            </button>
          </form>
          {error && (
            <div style={{ marginTop: 16, color: "red" }}>
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
        <div style={{ width: "70%", minWidth: 0 }}>
          <div
            style={{
              border: "1px solid #ddd",
              padding: 16,
              borderRadius: 8,
              position: "sticky",
              top: 20,
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>
              Conversation History
            </h3>
            {conversationHistory.length === 0 && !loading ? (
              <div
                style={{
                  color: "#999",
                  textAlign: "center",
                  padding: "40px 20px",
                }}
              >
                <p>Your question-answer pairs will appear here</p>
              </div>
            ) : (
              <>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {conversationHistory.map((entry, index) => (
                    <div
                      key={index}
                      style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 8,
                        padding: 10,
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: "12px" }}>
                          Question {index + 1}:
                        </strong>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            lineHeight: 1.5,
                            fontSize: "12px",
                          }}
                        >
                          {entry.question}
                        </p>
                      </div>
                      <div>
                        <strong style={{ fontSize: "12px" }}>Answer:</strong>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            lineHeight: 1.5,
                            fontSize: "12px",
                          }}
                        >
                          {entry.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {loading && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px",
                      marginTop: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        border: "4px solid #f3f3f3",
                        borderTop: "4px solid #3498db",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    <p style={{ marginTop: 16, color: "#666" }}>
                      Generating...
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckin;
