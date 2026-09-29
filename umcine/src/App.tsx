import { createContext, useContext, useState } from "react";

type StudyMode = "focus" | "break";

const StudyModeContext = createContext<StudyMode>("focus");

function StudyModeStatus() {
  const mode = useContext(StudyModeContext);

  return <p>현재 학습 모드: {mode}</p>;
}

export default function App() {
  const [mode, setMode] = useState<StudyMode>("focus");

  function handleToggleMode() {
    setMode((currentMode) =>
      currentMode === "focus" ? "break" : "focus",
    );
  }

  return (
    <StudyModeContext value={mode}>
      <main>
        <h1>학습 모드</h1>

        <StudyModeStatus />

        <button type="button" onClick={handleToggleMode}>
          모드 바꾸기
        </button>
      </main>
    </StudyModeContext>
  );
}