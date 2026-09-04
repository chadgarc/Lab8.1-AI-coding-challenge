import { useEffect, useState } from "react";
import DeckSlideshow from "./components/DeckSlideshow";
import SideBar from "./components/SideBar";
import { Layout } from "./components/layout/Layout";
import type { Deck, FlashCardData } from "./types";

/**
 * Coordinates deck persistence, selection, ordering, and the main learning views.
 * It connects SideBar, DeckSlideshow, and their child modes through callback props.
 */
function App() {
  const defaultDecks: Deck[] = [
  {
    id: "web-development",
    name: "Web Development",
    cards: [
      { front: "HTML", back: "Markup language for structuring web pages" },
      { front: "CSS", back: "Language for styling and layout" },
      { front: "Semantic HTML", back: "Tags that describe meaning (header, nav, main, footer)" },
      { front: "Flexbox", back: "One‑dimensional layout system for aligning items" },
      { front: "Grid", back: "Two‑dimensional layout system for complex designs" },
      { front: "Accessibility (a11y)", back: "Practices to make web content usable for everyone" },
      { front: "Responsive Design", back: "Design that adapts to different screen sizes" },
    ],
  },

  {
    id: "javascript",
    name: "JavaScript",
    cards: [
      { front: "const", back: "Declares a variable that cannot be reassigned" },
      { front: "let", back: "Declares a block‑scoped variable" },
      { front: "Arrow Functions", back: "Shorter syntax for writing functions" },
      { front: "Promises", back: "Handle asynchronous operations" },
      { front: "Async/Await", back: "Syntactic sugar for working with Promises" },
      { front: "DOM Manipulation", back: "Interact with and modify HTML elements" },
      { front: "Event Listeners", back: "Respond to user interactions (click, input, etc.)" },
    ],
  },

  {
    id: "typescript",
    name: "TypeScript",
    cards: [
      { front: "Interfaces", back: "Define the shape of objects and enforce structure" },
      { front: "Types", back: "Alias for defining custom type structures" },
      { front: "Union Types", back: "Allow a variable to be one of several types" },
      { front: "Generics", back: "Reusable components with type flexibility" },
      { front: "Enums", back: "Named constants for better readability" },
      { front: "Type Narrowing", back: "Refining types using conditions" },
      { front: "Type Inference", back: "TS automatically determines variable types" },
    ],
  },

  {
    id: "react",
    name: "React",
    cards: [
      { front: "useState", back: "Hook for managing component state" },
      { front: "useEffect", back: "Hook for side effects (fetch, subscriptions, etc.)" },
      { front: "Props", back: "Data passed from parent to child components" },
      { front: "State Lifting", back: "Sharing state by moving it to a common parent" },
      { front: "Controlled Components", back: "Form inputs managed by React state" },
      { front: "Component Composition", back: "Building UI by combining components" },
      { front: "Conditional Rendering", back: "Render UI based on conditions" },
    ],
  },

  {
    id: "bootstrap-vs-tailwind",
    name: "Bootstrap vs TailwindCSS",
    cards: [
      { front: "Bootstrap", back: "Component‑based framework with pre‑built UI elements" },
      { front: "TailwindCSS", back: "Utility‑first CSS framework for custom designs" },
      { front: "Bootstrap Grid", back: "12‑column layout system for responsive design" },
      { front: "Tailwind Utilities", back: "Classes like p‑4, flex, gap‑2 for styling" },
      { front: "Customization", back: "Tailwind is more flexible; Bootstrap is more opinionated" },
      { front: "Learning Curve", back: "Bootstrap is easier at first; Tailwind requires practice" },
      { front: "Design Freedom", back: "Tailwind gives full control; Bootstrap has a consistent look" },
    ],
  },
  {
    id: "react-advanced-hooks",
    name: "React Advanced Hooks",
    cards: [
      { front: "useCallback", back: "Memoizes a function to avoid unnecessary re-renders" },
      { front: "useMemo", back: "Memoizes expensive calculations" },
      { front: "useRef", back: "Stores mutable values that persist across renders" },
      { front: "useReducer", back: "Alternative to useState for complex state logic" },
      { front: "useLayoutEffect", back: "Runs synchronously after DOM mutations" },
      { front: "useImperativeHandle", back: "Customizes the instance value exposed by refs" },
      { front: "useDeferredValue", back: "Defers updates to improve UI responsiveness" },
      { front: "useTransition", back: "Marks state updates as non-urgent" },
      { front: "useId", back: "Generates unique IDs for accessibility and forms" },
      { front: "Custom Hooks", back: "Reusable logic extracted into functions starting with 'use'" },
    ],
  },

  {
    id: "docker",
    name: "Docker Essentials & Commands",
    cards: [
      { front: "docker ps", back: "Lists running containers" },
      { front: "docker images", back: "Shows downloaded images" },
      { front: "docker pull <image>", back: "Downloads an image from Docker Hub" },
      { front: "docker run <image>", back: "Runs a container from an image" },
      { front: "docker stop <id>", back: "Stops a running container" },
      { front: "docker rm <id>", back: "Removes a container" },
      { front: "docker rmi <image>", back: "Removes an image" },
      { front: "docker logs <id>", back: "Shows container logs" },
      { front: "docker-compose up -d", back: "Starts services in detached mode" },
      { front: "docker exec -it <id> bash", back: "Opens a shell inside a running container" },
    ],
  },
  {
    id: "frontend-interview",
    name: "Frontend Interview Questions",
    cards: [
      { front: "Event Bubbling", back: "Events propagate from child to parent elements" },
      { front: "Event Capturing", back: "Events propagate from parent to child elements" },
      { front: "Debounce", back: "Delays a function until user stops triggering it" },
      { front: "Throttle", back: "Limits how often a function can run" },
      { front: "CSR vs SSR", back: "Client-side vs server-side rendering differences" },
      { front: "Virtual DOM", back: "React's in-memory representation of the UI" },
      { front: "Shadow DOM", back: "Encapsulated DOM used in Web Components" },
      { front: "Critical Rendering Path", back: "Steps browser takes to render a page" },
      { front: "Reflow vs Repaint", back: "Layout recalculation vs visual update" },
      { front: "Accessibility (ARIA)", back: "Attributes that improve screen reader support" },
    ],
  },
];

  const [decks, setDecks] = useState<Deck[]>(() => {
    const savedDecks = localStorage.getItem("flashcard-decks");
    if (!savedDecks) return defaultDecks;

    try {
      const parsedDecks = JSON.parse(savedDecks) as Deck[];
      return parsedDecks.length > 0 ? parsedDecks : defaultDecks;
    } catch {
      return defaultDecks;
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
