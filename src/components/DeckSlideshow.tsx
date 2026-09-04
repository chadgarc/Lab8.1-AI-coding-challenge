import { useEffect, useState, type DragEvent, type FormEvent } from "react";
import FlashCard from "./FlashCard/FlashCard";
import TestMode from "./TestMode";
import StudyMode from "./StudyMode";
import editIcon from "../assets/edit_icon.svg";
import deleteIcon from "../assets/delete_icon.svg";
import type { Deck, FlashCardData } from "../types";

type DeckSlideshowProps = {
  deck: Deck;
  onAddCard: (card: FlashCardData) => void;
  onUpdateCard: (index: number, card: FlashCardData) => void;
  onDeleteCard: (index: number) => void;
  onToggleCardReview: (index: number) => void;
  onReorderCards: (fromIndex: number, toIndex: number) => void;
};

/**
 * Displays one deck as a slideshow with card management controls.
 * It connects to App through the deck value and mutation callbacks in DeckSlideshowProps.
 * @param props Selected deck data and App handlers for card operations.
 */
export default function DeckSlideshow({ deck, onAddCard, onUpdateCard, onDeleteCard, onToggleCardReview, onReorderCards }: DeckSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [isStudyOpen, setIsStudyOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [formError, setFormError] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isPlaying || deck.cards.length === 0) return;

    const timer = window.setInterval(() => {
      if (!isCardFlipped) {
        setIsCardFlipped(true);
      } else if (activeIndex === deck.cards.length - 1) {
        setIsPlaying(false);
      } else {
        setActiveIndex((current) => current + 1);
        setIsCardFlipped(false);
      }
    }, 3000);

    return () => window.clearInterval(timer);
  }, [activeIndex, deck.cards.length, isCardFlipped, isPlaying]);

  /** Validates and adds a new card through the App callback. */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const card = { front: front.trim(), back: back.trim() };
    if (!/\p{L}/u.test(card.front) || !/\p{L}/u.test(card.back)) {
      setFormError("Each field must contain at least one letter.");
      return;
    }

    onAddCard(card);
    setFront("");
    setBack("");
    setIsModalOpen(false);
    setActiveIndex(deck.cards.length);
    setIsCardFlipped(false);
    setFormError("");
  }

  /** Loads an existing card into the edit form. */
  function openEdit(index: number) {
    setEditingIndex(index);
    setFront(deck.cards[index].front);
    setBack(deck.cards[index].back);
    setFormError("");
  }

  /** Validates and saves the edited card through the App callback. */
  function handleEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const card = { front: front.trim(), back: back.trim() };
    if (editingIndex === null) return;
    if (!/\p{L}/u.test(card.front) || !/\p{L}/u.test(card.back)) {
      setFormError("Each field must contain at least one letter.");
      return;
    }

    onUpdateCard(editingIndex, card);
    setEditingIndex(null);
    setFront("");
    setBack("");
    setFormError("");
  }

  /** Confirms and removes a card through the App callback. */
  function removeCard(index: number) {
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    onDeleteCard(index);
    setActiveIndex((current) => Math.max(0, Math.min(current, deck.cards.length - 2)));
    setIsCardFlipped(false);
  }

  /** Moves the slideshow to the previous card. */
  function showPrevious() {
    setActiveIndex((current) =>
      current === 0 ? deck.cards.length - 1 : current - 1,
    );
    setIsCardFlipped(false);
  }

  /** Moves the slideshow to the next card. */
  function showNext() {
    setActiveIndex((current) => (current + 1) % deck.cards.length);
    setIsCardFlipped(false);
  }

  const activeCard = deck.cards[activeIndex];

  /** Renders the active card, controls, ordered card list, and card modals. */
  return (
    <section className="w-full max-w-xl rounded-lg border border-white/10 bg-black/10 p-5 text-left mt-16 lg:mt-0 lg:p-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-300">
            Active deck
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{deck.name}</h2>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 rounded-lg border border-white/15 bg-black/40 px-4 py-2 text-sm text-white/85 shadow-lg backdrop-blur transition hover:bg-black/60"
        >
          + Add card
        </button>
      </div>

      {activeCard ? (
        <>
          <div className="flex flex-col items-center gap-6">
            <div className="relative flex h-72 w-full max-w-md items-center justify-center">
              <div className="absolute h-64 w-[min(24rem,calc(100%-2rem))] translate-x-3 translate-y-3 rounded-box border border-white/10 bg-black/25" />
              <div className="absolute h-64 w-[min(24rem,calc(100%-2rem))] translate-x-1.5 translate-y-1.5 rounded-box border border-white/15 bg-black/35" />
              <div key={activeIndex} className="animate-[card-enter_220ms_ease-out]">
                <FlashCard
                  {...activeCard}
                  flipped={isCardFlipped}
                  onFlip={() => setIsCardFlipped((current) => !current)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsPlaying((current) => !current);
                  setIsCardFlipped(false);
                }}
                disabled={deck.cards.length === 0}
                aria-label={isPlaying ? "Pausar slideshow" : "Reproducir slideshow"}
                className="rounded-lg border border-white/15 bg-black/45 px-5 py-2 text-white/80 backdrop-blur transition hover:bg-black/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isPlaying ? "⏸ Pausar" : "▶ Play"}
              </button>
              <button
                type="button"
                disabled={deck.cards.length === 0}
                onClick={() => setIsTestOpen(true)}
                className="rounded-lg border border-white/15 bg-black/45 px-5 py-2 text-white/80 backdrop-blur transition hover:bg-black/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Test
              </button>
              <button
                type="button"
                disabled={deck.cards.length === 0}
                onClick={() => setIsStudyOpen(true)}
                className="rounded-lg border border-white/15 bg-black/45 px-5 py-2 text-white/80 backdrop-blur transition hover:bg-black/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Study
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Previous card"
                className="rounded-lg border border-white/15 bg-black/45 px-5 py-2 text-white/80 backdrop-blur transition hover:bg-black/70 hover:text-white"
              >
                ← Previous
              </button>
              <span className="min-w-16 text-center text-sm text-white/55">
                {activeIndex + 1} / {deck.cards.length}
              </span>
              <button
                type="button"
                onClick={showNext}
                aria-label="Next card"
                className="rounded-lg border border-white/15 bg-black/45 px-5 py-2 text-white/80 backdrop-blur transition hover:bg-black/70 hover:text-white"
              >
                Next →
              </button>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6">
            <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-white/60">
              Deck cards
            </h3>
            <ol className="mt-4 divide-y divide-white/10 rounded-lg border border-white/10 bg-black/20">
              {deck.cards.map((card, index) => (
                <li
                  key={`${card.front}-${index}`}
                  draggable
                  onDragStart={() => setDraggedIndex(index)}
                  onDragOver={(event: DragEvent<HTMLLIElement>) => event.preventDefault()}
                  onDrop={() => {
                    if (draggedIndex !== null && draggedIndex !== index) {
                      onReorderCards(draggedIndex, index);
                      setActiveIndex(index);
                    }
                    setDraggedIndex(null);
                  }}
                  onDragEnd={() => setDraggedIndex(null)}
                >
                  <div className={`flex items-center gap-4 px-4 py-3 transition hover:bg-white/10 ${index === activeIndex ? "bg-white/10" : ""}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveIndex(index);
                        setIsCardFlipped(false);
                      }}
                      className="flex min-w-0 flex-1 items-center gap-4 text-left"
                    >
                      <span className="flex w-6 shrink-0 items-center gap-1 text-sm text-blue-300">
                        {card.review && <span className="font-bold text-amber-300">!</span>}
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-white/90">{card.front}</span>
                      <span className="max-w-[40%] truncate text-sm text-white/45">{card.back}</span>
                    </button>
                    <ul className="menu menu-horizontal bg-base-200/60 rounded-box p-0 shrink-0 border border-white/10">
                      <li>
                        <button
                          type="button"
                          className="tooltip tooltip-top hover:bg-blue-500/20 p-2 text-blue-300 transition"
                          data-tip="Edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(index);
                          }}
                          aria-label="Edit card"
                        >
                          <img src={editIcon} alt="Edit" className="h-4 w-4 shrink-0" />
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="tooltip tooltip-top hover:bg-red-500/20 p-2 text-red-300 transition"
                          data-tip="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCard(index);
                          }}
                          aria-label="Delete card"
                        >
                          <img src={deleteIcon} alt="Delete" className="h-4 w-4 shrink-0" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-black/20 px-6 text-center">
              <p className="text-white/60">This deck does not have any cards yet.</p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 rounded-lg border border-white/15 bg-black/45 px-4 py-2 text-sm text-white/80 transition hover:bg-black/70 hover:text-white"
          >
            Create the first card
          </button>
        </div>
      )}

      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box border border-white/10 bg-[#161618] text-white">
          <h3 className="text-xl font-semibold">Add card</h3>
          <p className="mt-1 text-sm text-white/55">Add the prompt and its answer.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-sm text-white/75">
              Front
              <textarea
                value={front}
                onChange={(event) => setFront(event.target.value)}
                className="mt-2 h-24 w-full resize-none rounded-lg border border-white/15 bg-black/30 p-3 text-white outline-none placeholder:text-white/35 focus:border-blue-300"
                placeholder="What do you want to remember?"
                required
              />
            </label>
            {formError && <p className="text-sm text-red-300">{formError}</p>}
            <label className="block text-sm text-white/75">
              Back
              <textarea
                value={back}
                onChange={(event) => setBack(event.target.value)}
                className="mt-2 h-24 w-full resize-none rounded-lg border border-white/15 bg-black/30 p-3 text-white outline-none placeholder:text-white/35 focus:border-blue-300"
                placeholder="Write the answer"
                required
              />
            </label>
            <div className="modal-action">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-white/15 bg-black/40 px-4 py-2 text-sm text-white/70 transition hover:bg-black/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
              >
                Save card
              </button>
            </div>
          </form>
        </div>
        <button
          type="button"
          aria-label="Close modal"
          className="modal-backdrop"
          onClick={() => setIsModalOpen(false)}
        />
      </dialog>
      <dialog className={`modal ${editingIndex !== null ? "modal-open" : ""}`}>
        <div className="modal-box border border-white/10 bg-[#161618] text-white">
          <h3 className="text-xl font-semibold">Edit card</h3>
          <form onSubmit={handleEdit} className="mt-6 space-y-4">
            <label className="block text-sm text-white/75">Front<textarea value={front} onChange={(event) => setFront(event.target.value)} className="mt-2 h-24 w-full resize-none rounded-lg border border-white/15 bg-black/30 p-3 text-white outline-none focus:border-blue-300" required /></label>
            <label className="block text-sm text-white/75">Back<textarea value={back} onChange={(event) => setBack(event.target.value)} className="mt-2 h-24 w-full resize-none rounded-lg border border-white/15 bg-black/30 p-3 text-white outline-none focus:border-blue-300" required /></label>
            {formError && <p className="text-sm text-red-300">{formError}</p>}
            <div className="modal-action"><button type="button" onClick={() => setEditingIndex(null)} className="rounded-lg border border-white/15 bg-black/40 px-4 py-2 text-sm text-white/70">Cancel</button><button type="submit" className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium">Save changes</button></div>
          </form>
        </div>
      </dialog>
      {isTestOpen && <TestMode deck={deck} onClose={() => setIsTestOpen(false)} />}
      {isStudyOpen && (
        <StudyMode
          deck={deck}
          onClose={() => setIsStudyOpen(false)}
          onToggleReview={onToggleCardReview}
        />
      )}
    </section>
  );
}
