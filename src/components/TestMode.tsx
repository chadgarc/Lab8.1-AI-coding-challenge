import { useState, type FormEvent } from "react";
import type { Deck, FlashCardData } from "../types";

type TestModeProps = {
  deck: Deck;
  onClose: () => void;
};

type TestSettings = {
  questionCount: number;
  side: "front" | "back" | "both";
  trueFalse: boolean;
  multipleChoice: boolean;
  matching: boolean;
};

type Question = {
  card: FlashCardData;
  type: "trueFalse" | "multipleChoice" | "matching";
  prompt: string;
  answer: string;
  options?: string[];
  statement?: string;
};

const initialSettings: TestSettings = {
  questionCount: 1,
  side: "front",
  trueFalse: true,
  multipleChoice: true,
  matching: true,
};

/** Returns a randomized copy used to vary answer choices. */
function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

/** Builds the configured question set from the selected deck cards. */
function buildQuestions(cards: FlashCardData[], settings: TestSettings): Question[] {
  const enabledTypes = [
    ...(settings.trueFalse ? (["trueFalse"] as const) : []),
    ...(settings.multipleChoice ? (["multipleChoice"] as const) : []),
    ...(settings.matching ? (["matching"] as const) : []),
  ];
  return cards.slice(0, settings.questionCount).map((card, index) => {
    const source = settings.side === "both"
      ? index % 2 === 0 ? "front" : "back"
      : settings.side;
    const target = source === "front" ? "back" : "front";
    const type = enabledTypes[index % enabledTypes.length];
    if (type === "trueFalse") {
      const isCorrect = index % 2 === 0;
      const statement = isCorrect
        ? card[target]
        : cards[(index + 1) % cards.length][target];
      return {
        card,
        type,
        prompt: `Does this definition belong to “${card[source]}”?`,
        statement,
        answer: String(isCorrect),
      };
    }

    if (type === "multipleChoice") {
      const wrong = cards.find((other) => other.front !== card.front)?.[target] ?? "Another answer";
      return {
        card,
        type,
        prompt: `Select the answer for “${card[source]}”`,
        options: shuffle([card[target], wrong]),
        answer: card[target],
      };
    }

    return {
      card,
      type,
      prompt: "Match the term with its correct definition",
      options: shuffle([card.front, card.back]),
      answer: `${card.front}::${card.back}`,
    };
  });
}

/**
 * Provides a layered test experience for a deck and reports the final score.
 * It connects to DeckSlideshow through the deck data and close callback.
 * @param props Selected deck and the parent callback used to leave test mode.
 */
export default function TestMode({ deck, onClose }: TestModeProps) {
  const [settings, setSettings] = useState<TestSettings>({
    ...initialSettings,
    questionCount: Math.max(1, Math.min(deck.cards.length, 5)),
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const [matchingTerm, setMatchingTerm] = useState("");
  const [matchingDefinition, setMatchingDefinition] = useState("");

  /** Creates a new test from the selected settings. */
  function startTest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuestions = buildQuestions(deck.cards, settings);
    setQuestions(nextQuestions);
    setAnswers([]);
    setCurrentIndex(0);
    setResult(null);
    setMatchingTerm("");
    setMatchingDefinition("");
  }

  /** Stores an answer and advances or completes the current test. */
  function submitAnswer(answer: string) {
    const nextAnswers = [...answers, answer];
    if (currentIndex === questions.length - 1) {
      setAnswers(nextAnswers);
      setResult(nextAnswers.filter((value, index) => value === questions[index].answer).length);
    } else {
      setAnswers(nextAnswers);
      setCurrentIndex((index) => index + 1);
      setMatchingTerm("");
      setMatchingDefinition("");
    }
  }

  const question = questions[currentIndex];

  /** Renders test setup, one question at a time, or the final score layer. */
  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-[#090a0d]/95 p-4 backdrop-blur-md md:p-10">
      <div className="mx-auto flex min-h-full max-w-3xl items-center justify-center">
        <div className="w-full rounded-lg border border-white/10 bg-[#161618] p-6 text-white shadow-2xl md:p-10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Test mode</p>
              <h2 className="mt-2 text-3xl font-semibold">{deck.name}</h2>
            </div>
            <button type="button" onClick={onClose} className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white/70 hover:bg-black/70">Close</button>
          </div>

          {result === null && !question && (
            <form onSubmit={startTest} className="space-y-6">
              <label className="block text-sm text-white/75">
                Number of questions
                <select value={settings.questionCount} onChange={(event) => setSettings({ ...settings, questionCount: Number(event.target.value) })} className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 p-3 text-white outline-none focus:border-blue-300">
                  {deck.cards.map((_, index) => <option key={index} value={index + 1}>{index + 1}</option>)}
                </select>
              </label>
              <label className="block text-sm text-white/75">
                What do you want to practice?
                <select value={settings.side} onChange={(event) => setSettings({ ...settings, side: event.target.value as TestSettings["side"] })} className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 p-3 text-white outline-none focus:border-blue-300">
                  <option value="front">Term (front)</option>
                  <option value="back">Definition (back)</option>
                  <option value="both">Both</option>
                </select>
              </label>
              <fieldset className="space-y-3">
                <legend className="mb-2 text-sm text-white/75">Question types</legend>
                {(["trueFalse", "multipleChoice", "matching"] as const).map((type) => (
                  <label key={type} className="flex items-center gap-3 text-sm text-white/70">
                    <input type="checkbox" checked={settings[type]} onChange={(event) => setSettings({ ...settings, [type]: event.target.checked })} className="checkbox checkbox-info checkbox-sm" />
                    {type === "trueFalse" ? "True or false" : type === "multipleChoice" ? "Multiple choice" : "Matching"}
                  </label>
                ))}
              </fieldset>
              <button type="submit" disabled={!settings.trueFalse && !settings.multipleChoice && !settings.matching} className="w-full rounded-lg bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-400 disabled:opacity-40">Start test</button>
            </form>
          )}

          {question && result === null && (
            <div className="animate-[card-enter_220ms_ease-out] space-y-6">
              <div className="flex justify-between text-sm text-white/45"><span>Question {currentIndex + 1}</span><span>{questions.length} total</span></div>
              <div className="min-h-56 rounded-lg border border-white/10 bg-black/25 p-6">
                <p className="text-lg text-white/90">{question.prompt}</p>
                {question.type === "trueFalse" && <><p className="mt-8 text-center text-2xl text-blue-200">{question.statement}</p><div className="mt-8 grid grid-cols-2 gap-3"><button type="button" onClick={() => submitAnswer("true")} className="rounded-lg border border-white/15 bg-black/45 px-4 py-3 hover:bg-blue-500/30">True</button><button type="button" onClick={() => submitAnswer("false")} className="rounded-lg border border-white/15 bg-black/45 px-4 py-3 hover:bg-blue-500/30">False</button></div></>}
                {question.type === "multipleChoice" && <div className="mt-8 grid gap-3">{question.options?.map((option) => <button key={option} type="button" onClick={() => submitAnswer(option)} className="rounded-lg border border-white/15 bg-black/45 p-3 text-left hover:bg-blue-500/30">{option}</button>)}</div>}
                {question.type === "matching" && <div className="mt-8 grid gap-3 md:grid-cols-2"><select value={matchingTerm} onChange={(event) => setMatchingTerm(event.target.value)} className="rounded-lg border border-white/15 bg-black/40 p-3 text-white"><option value="">Choose term</option><option value={question.card.front}>{question.card.front}</option></select><select value={matchingDefinition} onChange={(event) => setMatchingDefinition(event.target.value)} className="rounded-lg border border-white/15 bg-black/40 p-3 text-white"><option value="">Choose definition</option><option value={question.card.back}>{question.card.back}</option></select><button type="button" disabled={!matchingTerm || !matchingDefinition} onClick={() => submitAnswer(`${matchingTerm}::${matchingDefinition}`)} className="rounded-lg bg-blue-500 px-4 py-3 md:col-span-2 disabled:opacity-40">Match</button></div>}
              </div>
            </div>
          )}

          {result !== null && <div className="text-center"><p className="text-sm uppercase tracking-[0.2em] text-blue-300">Result</p><p className="mt-5 text-6xl font-semibold text-white">{result} / {questions.length}</p><p className="mt-3 text-white/60">You completed the test.</p><button type="button" onClick={onClose} className="mt-8 rounded-lg bg-blue-500 px-5 py-3 font-medium hover:bg-blue-400">Back to deck</button></div>}
        </div>
      </div>
    </div>
  );
}
