import React, { useEffect, useState } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("http://localhost:4000/questions", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch questions");
        return r.json();
      })
      .then((data) => setQuestions(data))
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("Error loading questions:", err);
      });

    return () => controller.abort();
  }, []);


  function handleAddQuestion(newQuestion) {
    setQuestions((prev) => [...prev, newQuestion]);
    setPage("List");
  }

  function handleDeleteQuestion(id) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }


  function handleUpdateQuestion(id, newCorrectIndex) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, correctIndex: Number(newCorrectIndex) } : q
      )
    );
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />

      {page === "Form" ? (
        <QuestionForm onAddQuestion={handleAddQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      )}
    </main>
  );
}

export default App;
