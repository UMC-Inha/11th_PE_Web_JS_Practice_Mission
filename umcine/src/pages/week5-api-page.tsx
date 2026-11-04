import { useState } from "react";
import { backendClient } from "../api/backend-client";

interface ApiCheckProps {
  title: string;
  placeholder: string;
  getPath: (value: string) => string;
}

function ApiCheck({ title, placeholder, getPath }: ApiCheckProps) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    const input = value.trim();

    if (!input) {
      setResult("값을 입력해 주세요.");
      return;
    }

    setIsLoading(true);
    setResult("");

    try {
      const response = await backendClient
        .get(getPath(input), { retry: 0 })
        .json<unknown>();

      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(
        error instanceof Error
          ? error.message
          : "요청 중 오류가 발생했어요.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
      <h2>{title}</h2>

      <input
        aria-label={title}
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />

      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? "요청 중..." : "확인"}
      </button>

      <pre aria-live="polite">{result}</pre>
    </section>
  );
}

export function ApiTestPage() {
  return (
    <main>
      <h1>백엔드 API 연결 확인</h1>

      <ApiCheck
        title="닉네임 사용 가능 여부"
        placeholder="닉네임 입력"
        getPath={(value) =>
          `members/nickname/${encodeURIComponent(value)}`
        }
      />

      <ApiCheck
        title="이메일 사용 가능 여부"
        placeholder="이메일 입력"
        getPath={(value) =>
          `members/email/${encodeURIComponent(value)}`
        }
      />

      <ApiCheck
        title="회원별 평가 목록"
        placeholder="회원 ID 입력"
        getPath={(value) =>
          `members/${encodeURIComponent(value)}/ratings?page=0&size=10`
        }
      />
    </main>
  );
}