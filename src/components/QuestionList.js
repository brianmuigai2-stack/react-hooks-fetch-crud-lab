import React from "react";
import QuestionItem from "./QuestionItem";

export default function QuestionList({ questions, onDeleteQuestion, onUpdateQuestion }) {
  if (!questions || questions.length === 0) {
    return <p>No questions available.</p>;
  }

  return (
    <ul className="QuestionList">
      {questions.map((q) => (
        <QuestionItem
          key={q.id}
          question={q}
          onDeleteQuestion={onDeleteQuestion}
          onUpdateQuestion={onUpdateQuestion}
        />
      ))}
    </ul>
  );
}
