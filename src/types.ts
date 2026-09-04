/** Stores the visible content and review status of one flashcard. */
export type FlashCardData = {
  front: string;
  back: string;
  review?: boolean;
};

/** Groups an ordered collection of flashcards under one deck name. */
export type Deck = {
  id: string;
  name: string;
  cards: FlashCardData[];
};
