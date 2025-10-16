import React, { useState, useRef, useEffect } from "react";

export default function QuestionForm({ onAddQuestion }) {
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  function handleAnswerChange(index, value) {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const body = {
      prompt: prompt,
      answers: answers,
      correctIndex: Number(correctIndex),
    };

    setSubmitting(true);
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to create question");
        return r.json();
      })
      .then((createdQuestion) => {
        // only update local state if component is still mounted
        onAddQuestion(createdQuestion);
        if (mountedRef.current) {
          setPrompt("");
          setAnswers(["", "", "", ""]);
          setCorrectIndex(0);
        }
      })
      .catch((err) => console.error("Error creating question:", err))
      .finally(() => {
        if (mountedRef.current) setSubmitting(false);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Prompt
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </label>
      </div>

      <fieldset>
        <legend>Answers</legend>
        {answers.map((a, i) => (
          <label key={i}>
            {`Answer ${i + 1}`}
            <input
              type="text"
              value={a}
              onChange={(e) => handleAnswerChange(i, e.target.value)}
              required
            />
          </label>
        ))}
      </fieldset>

      <label>
        Correct Answer
        <select
          value={correctIndex}
          onChange={(e) => setCorrectIndex(Number(e.target.value))}
        >
          {answers.map((_, i) => (
            <option key={i} value={i}>
              Answer {i + 1}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Add Question"}
      </button>
    </form>
  );
}
