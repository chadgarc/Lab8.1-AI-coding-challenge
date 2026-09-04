import { useEffect, useState } from "react";
import DeckSlideshow from "./components/DeckSlideshow";
import SideBar from "./components/SideBar";
import { Layout } from "./components/layout/Layout";
import type { Deck, FlashCardData } from "./types";
import { DataSet } from "./Data/DataSet";

/**
 * Coordinates deck persistence, selection, ordering, and the main learning views.
 * It connects SideBar, DeckSlideshow, and their child modes through callback props.
 */
function App() {

  const [decks, setDecks] = useState<Deck[]>(() => {
    const savedDecks = localStorage.getItem("flashcard-decks");
    if (!savedDecks) return DataSet;

    try {
      const parsedDecks = JSON.parse(savedDecks) as Deck[];
      return parsedDecks.length > 0 ? parsedDecks : DataSet;
    } catch {
      return DataSet;
    }
  });
  const [selectedDeckId, setSelectedDeckId] = useState(decks[0]?.id ?? "");

  useEffect(() => {
    localStorage.setItem("flashcard-decks", JSON.stringify(decks));
  }, [decks]);

  const selectedDeck = decks.find((deck) => deck.id === selectedDeckId);

  /** Creates a new empty deck and selects it immediately. */
  function createDeck(name: string) {
    const newDeck: Deck = {
      id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      name,
      cards: [],
    };

    setDecks((currentDecks) => [...currentDecks, newDeck]);
    setSelectedDeckId(newDeck.id);
  }

  /** Adds a card to the currently selected deck. */
  function addCard(card: FlashCardData) {
    setDecks((currentDecks) =>
      currentDecks.map((deck) =>
        deck.id === selectedDeckId
          ? { ...deck, cards: [...deck.cards, card] }
          : deck,
      ),
    );
  }

  /** Replaces one card in the currently selected deck. */
  function updateCard(index: number, card: FlashCardData) {
    setDecks((currentDecks) =>
      currentDecks.map((deck) =>
        deck.id === selectedDeckId
          ? { ...deck, cards: deck.cards.map((item, itemIndex) => itemIndex === index ? card : item) }
          : deck,
      ),
    );
  }

  /** Removes one card from the currently selected deck. */
  function deleteCard(index: number) {
    setDecks((currentDecks) =>
      currentDecks.map((deck) =>
        deck.id === selectedDeckId
          ? { ...deck, cards: deck.cards.filter((_, itemIndex) => itemIndex !== index) }
          : deck,
      ),
    );
  }

  /** Toggles whether one selected-deck card should be reviewed later. */
  function toggleCardReview(index: number) {
    setDecks((currentDecks) =>
      currentDecks.map((deck) =>
        deck.id === selectedDeckId
          ? {
              ...deck,
              cards: deck.cards.map((card, cardIndex) =>
                cardIndex === index ? { ...card, review: !card.review } : card,
              ),
            }
          : deck,
      ),
    );
  }

  /** Moves a deck to a new position in the ordered deck list. */
  function reorderDecks(fromIndex: number, toIndex: number) {
    setDecks((currentDecks) => {
      const nextDecks = [...currentDecks];
      const [movedDeck] = nextDecks.splice(fromIndex, 1);
      nextDecks.splice(toIndex, 0, movedDeck);
      return nextDecks;
    });
  }

  /** Moves a card to a new position inside the selected deck. */
  function reorderCards(fromIndex: number, toIndex: number) {
    setDecks((currentDecks) =>
      currentDecks.map((deck) => {
        if (deck.id !== selectedDeckId) return deck;

        const cards = [...deck.cards];
        const [movedCard] = cards.splice(fromIndex, 1);
        cards.splice(toIndex, 0, movedCard);
        return { ...deck, cards };
      }),
    );
  }

  /** Renders the persistent deck navigator and the selected deck workspace. */
  return (
    <Layout>
      <div className="flex min-h-screen flex-col md:flex-row">
        <SideBar
          decks={decks}
          selectedDeckId={selectedDeckId}
          onSelectDeck={setSelectedDeckId}
          onCreateDeck={createDeck}
          onReorderDecks={reorderDecks}
        />
        <main className="flex flex-1 flex-col items-center p-6 md:p-12">
          {selectedDeck && (
            <DeckSlideshow
              key={selectedDeck.id}
              deck={selectedDeck}
              onAddCard={addCard}
              onUpdateCard={updateCard}
              onDeleteCard={deleteCard}
              onToggleCardReview={toggleCardReview}
              onReorderCards={reorderCards}
            />
          )}
        </main>
      </div>
    </Layout>
  )
}

export default App
