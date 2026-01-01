import { useState } from "react";

const API_BASE = "https://storia-ai-docker-image-bkavgfk3ha-od.a.run.app";

const DailyStoria = ({ onNavigateHome }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [username, setUsername] = useState("");
  const [availableGoals, setAvailableGoals] = useState([
    "💭 Understand my thoughts and feelings",
    "🪷  Cultivate gratitude and joy in my life",
    "🌟  Spark creativity and ideas",
    "🔮  Discover myself and clarify values",
    "💞  Foster connection, share experiences",
  ]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [customGoalInput, setCustomGoalInput] = useState("");
  const [history, setHistory] = useState("[]");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);

  const handleToggleGoal = (goal) => {
    setSelectedGoals((prev) => {
      if (prev.includes(goal)) {
        return prev.filter((g) => g !== goal);
      } else if (prev.length < 3) {
        return [...prev, goal];
      }
      return prev;
    });
  };

  const handleAddCustomGoal = () => {
    if (
      customGoalInput.trim() &&
      !availableGoals.includes(customGoalInput.trim())
    ) {
      setAvailableGoals((prev) => [...prev, customGoalInput.trim()]);
      setCustomGoalInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic required-field validation
    if (!question.trim() || !answer.trim()) {
      setError(
        "Please fill in both Question and Answer. All other fields are optional."
      );
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    const selected_goals = selectedGoals;

    let historical_entries = [];
    if (history.trim() !== "") {
      try {
        historical_entries = JSON.parse(history);
      } catch (err) {
        setError("Historical entries must be valid JSON (e.g. [] or [{...}])");
        setLoading(false);
        return;
      }
    }

    const payload = {
      question,
      answer,
      username: username || null,
      selected_goals,
      historical_entries,
    };

    try {
      const res = await fetch(`${API_BASE}/storia/dailyStoria/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text}`);
      }

      const data = await res.json();
      console.log(data);
      setResponse(data);
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
        Daily Storia API Playground
      </h2>
      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        <div style={{ width: "50%", minWidth: 0 }}>
          <form
            onSubmit={handleSubmit}
            style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}
          >
            <div style={{ marginBottom: 8 }}>
              <label>Question</label>
              <input
                style={{ width: "100%" }}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Answer</label>
              <textarea
                style={{ width: "100%" }}
                rows={3}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Username (optional)</label>
              <input
                style={{ width: "100%" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>
                Selected goals (max 3) - {selectedGoals.length}/3 selected
              </label>
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  padding: 12,
                  maxHeight: 200,
                  overflowY: "auto",
                  marginTop: 8,
                }}
              >
                {availableGoals.map((goal) => {
                  const isSelected = selectedGoals.includes(goal);
                  const isDisabled = !isSelected && selectedGoals.length >= 3;
                  return (
                    <div
                      key={goal}
                      style={{
                        marginBottom: 8,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`goal-${goal}`}
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => handleToggleGoal(goal)}
                        style={{
                          marginRight: 8,
                          cursor: isDisabled ? "not-allowed" : "pointer",
                        }}
                      />
                      <label
                        htmlFor={`goal-${goal}`}
                        style={{
                          cursor: isDisabled ? "not-allowed" : "pointer",
                          opacity: isDisabled ? 0.5 : 1,
                          flex: 1,
                        }}
                      >
                        {goal}
                      </label>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <input
                  type="text"
                  placeholder="Add custom goal..."
                  value={customGoalInput}
                  onChange={(e) => setCustomGoalInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomGoal();
                    }
                  }}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomGoal}
                  disabled={!customGoalInput.trim()}
                >
                  Add
                </button>
              </div>
            </div>
            {/* <div style={{ marginBottom: 8 }}>
            <label>Historical entries (JSON array)</label>
            <textarea
              style={{ width: "100%" }}
              rows={3}
              value={history}
              onChange={(e) => setHistory(e.target.value)}
            />
          </div> */}
            <button
              type="submit"
              disabled={loading || !question.trim() || !answer.trim()}
            >
              {loading ? "Generating..." : "Generate Daily Storia Insight"}
            </button>
          </form>
          {error && (
            <div style={{ marginTop: 16, color: "red" }}>
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
        <div style={{ width: "50%", minWidth: 0 }}>
          {loading ? (
            <div
              style={{
                border: "1px solid #ddd",
                padding: 16,
                borderRadius: 8,
                position: "sticky",
                top: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 200,
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
              <p style={{ marginTop: 16, color: "#666" }}>Generating...</p>
            </div>
          ) : response ? (
            <div
              style={{
                border: "1px solid #ddd",
                padding: 16,
                borderRadius: 8,
                position: "sticky",
                top: 20,
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 16 }}>Response</h3>
              <div style={{ marginBottom: 16 }}>
                <strong style={{ display: "block", marginBottom: 4 }}>
                  Title:
                </strong>
                <p style={{ margin: 0, fontSize: "1.1em", fontWeight: 500 }}>
                  {response.title}
                </p>
              </div>
              <div>
                <strong style={{ display: "block", marginBottom: 4 }}>
                  Insight:
                </strong>
                <p
                  style={{ margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}
                >
                  {response.insight}
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                border: "1px solid #ddd",
                padding: 16,
                borderRadius: 8,
                position: "sticky",
                top: 20,
                color: "#999",
                textAlign: "center",
                minHeight: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p>Response will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyStoria;
