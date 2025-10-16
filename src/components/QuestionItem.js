import React, { useEffect, useRef, useState } from "react";

export default function QuestionItem({ question, onDeleteQuestion, onUpdateQuestion }) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  function handleCorrectChange(e) {
    const newIndex = Number(e.target.value);

    
    onUpdateQuestion(question.id, newIndex);
    setUpdating(true);

    fetch(`http://localhost:4000/questions/${question.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex: newIndex }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to update question");
        return r.json();
      })
      .then((updatedQuestion) => {
        
        onUpdateQuestion(question.id, updatedQuestion.correctIndex);
      })
      .catch((err) => {
        console.error("Error updating question:", err);
        
        onUpdateQuestion(question.id, question.correctIndex);
      })
      .finally(() => {
        if (mountedRef.current) setUpdating(false);
      });
  }

  function handleDelete() {
    setDeleting(true);

    fetch(`http://localhost:4000/questions/${question.id}`, {
      method: "DELETE",
    })
      .then((r) => {
        if (!r.ok && r.status !== 200 && r.status !== 204) {
          throw new Error("Failed to delete");
        }
        
        onDeleteQuestion(question.id);
      })
      .catch((err) => {
        console.error("Error deleting question:", err);
        
      })
      .finally(() => {
        if (mountedRef.current) setDeleting(false);
      });
  }

  return (
    <li className="QuestionItem">
      <div>
        <strong>{question.prompt}</strong>
      </div>

      <ol type="A">
        {question.answers.map((ans, i) => (
          <li key={i}>
            {ans}
            {i === question.correctIndex ? " (correct)" : ""}
          </li>
        ))}
      </ol>

      <label>
        Correct Answer
        <select
          value={question.correctIndex}
          onChange={handleCorrectChange}
          disabled={updating}
        >
          {question.answers.map((_, i) => (
            <option key={i} value={i}>
              Answer {i + 1}
            </option>
          ))}
        </select>
      </label>

      <button onClick={handleDelete} disabled={deleting}>
        {deleting ? "Deleting..." : "Delete Question"}
      </button>
    </li>
  );
}
