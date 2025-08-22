import { useState, useEffect } from "react";
import { generateExam } from "./api";

export default function App() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(true); 

  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  async function onGenerate() {
    setError("");
    setResult(null);
    setCopied(false);

    const trimmedTopic = topic.trim();
    const n = Number(count);
    if (!trimmedTopic) {
      setError("Please enter a topic.");
      return;
    }
    if (!Number.isInteger(n) || n <= 0) {
      setError("Please enter a valid whole number of questions (e.g., 5).");
      return;
    }
    if (n > 50) {
      setError("Please request 50 questions or fewer.");
      return;
    }

    try {
      setLoading(true);
      const data = await generateExam(trimmedTopic, n);
      setResult(data?.questions ?? null);
    } catch (e) {
      setError(e.message || "Failed to generate exam. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function buildExportText(includeAnswers) {
    if (!result) return "";

    if (typeof result === "string") return result;

    if (Array.isArray(result)) {
      return result
        .map((item, idx) => {
          if (typeof item === "string") {
            return `${idx + 1}. ${item}`;
          }
          const q = item?.question ?? "";
          const a = item?.answer ?? "";
          const base = `${idx + 1}. ${q}`;
          return includeAnswers && a ? `${base}\nAnswer: ${a}` : base;
        })
        .join("\n\n");
    }

    return "";
  }

  async function copyToClipboard() {
    try {
      const text = buildExportText(showAnswers);
      if (!text.trim()) {
        setError("Nothing to copy yet. Generate the exam first.");
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Copy failed. Select and copy manually (Ctrl/Cmd + C).");
    }
  }

  function renderResult(r) {
    if (!r) return null;

    if (typeof r === "string") {
      return (
        <pre className="whitespace-pre-wrap break-words text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded border">
          {r}
        </pre>
      );
    }

    if (Array.isArray(r)) {
      return (
        <ol className="list-decimal pl-6 space-y-3">
          {r.map((item, idx) => {
            if (typeof item === "string") {
              return <li key={idx}>{item}</li>;
            }
            return (
              <li key={idx}>
                <div className="font-medium">{item.question || "Question"}</div>
                {showAnswers && item.answer && (
                  <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                    <span className="font-semibold">Answer:</span> {item.answer}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      );
    }

    return <div className="text-sm text-gray-600">Unexpected response format.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6 transition-colors">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl shadow p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-center">AI Exam Generator</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="cursor-pointer px-3 py-1 rounded-lg text-sm bg-gray-200 dark:bg-gray-700 hover:opacity-80"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder='Topic (e.g., "Multiplication", "Addition")'
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
            aria-label="Topic"
          />

          <input
            type="number"
            min="1"
            step="1"
            placeholder="Number of questions"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
            aria-label="Number of questions"
          />

          <button
            onClick={onGenerate}
            disabled={loading}
            className="cursor-pointer w-full rounded-lg py-2 font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Exam"}
          </button>

          {error && (
            <div
              role="alert"
              className="text-red-700 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3"
            >
              {error}
            </div>
          )}
        </div>

        {/* Controls */}
        {result && (
          <div className="flex items-center justify-between gap-3 border-t dark:border-gray-700 pt-4">
            <label className="cursor-pointer inline-flex items-center gap-2 select-none">
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={showAnswers}
                onChange={(e) => setShowAnswers(e.target.checked)}
              />
              <span className="text-sm">Show Answer Key</span>
            </label>

            <button
              onClick={copyToClipboard}
              className="cursor-pointer px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white hover:opacity-80"
              title={showAnswers ? "Copy exam + answers" : "Copy questions only"}
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Generated Questions</h2>
            {renderResult(result)}
          </div>
        )}
      </div>
    </div>
  );
}
