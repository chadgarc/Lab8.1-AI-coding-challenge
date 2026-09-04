import { useState, type ReactNode } from "react";

type FlashCardProps = {
  front: ReactNode;
  back: ReactNode;
  flipped?: boolean;
  onFlip?: () => void;
};

/**
 * Renders a clickable card that flips between front and back content.
 * It connects to slideshow and study-mode parents through optional controlled flip props.
 * @param props Front/back content and optional controlled flip callbacks from the parent component.
 */
export default function FlashCard({ front, back, flipped, onFlip }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardIsFlipped = flipped ?? isFlipped;

  /** Toggles the local card state or delegates the flip to the parent controller. */
  function handleFlip() {
    if (onFlip) onFlip();
    else setIsFlipped((current) => !current);
  }

  /** Renders the two card faces and exposes the flip interaction. */
  return (
    <button
      type="button"
      aria-label="Flip flashcard"
      onClick={handleFlip}
      className="group h-64 w-full max-w-96 [perspective:1000px]"
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          cardIsFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 flex items-center justify-center rounded-box border border-base-300 bg-base-100 p-6 text-center shadow-xl [backface-visibility:hidden]">
          {front}
        </div>

        {/* Back */}
        <div className="absolute inset-0 flex items-center justify-center rounded-box border border-primary bg-primary p-6 text-center text-primary-content shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {back}
        </div>
      </div>
    </button>
  );
}

