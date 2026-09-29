import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>카운터</h1>
      <p>현재 값: {count}</p>

      <button
        type="button"
        disabled={count === 5}
        onClick={() => setCount((current) => current + 1)}
      >
        +1
      </button>

      <button
        type="button"
        disabled={count === 0}
        onClick={() => setCount((current) => current - 1)}
      >
        -1
      </button>

      <button type="button" onClick={() => setCount(0)}>
        초기화
      </button>
    </main>
  );
}