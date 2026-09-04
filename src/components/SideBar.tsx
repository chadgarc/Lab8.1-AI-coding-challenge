import { useState, type FormEvent } from "react";
import type { Deck } from "../types";

type SideBarProps = {
	decks: Deck[];
	selectedDeckId: string;
	onSelectDeck: (deckId: string) => void;
	onCreateDeck: (name: string) => void;
	onReorderDecks: (fromIndex: number, toIndex: number) => void;
};

/**
 * Provides deck creation, selection, and drag-and-drop ordering.
 * It connects to App through deck data and callbacks received in SideBarProps.
 * @param props Ordered decks, selected deck id, and App handlers for deck actions.
 */
export default function SideBar({
	decks,
	selectedDeckId,
	onSelectDeck,
	onCreateDeck,
	onReorderDecks,
}: SideBarProps) {
	const [deckName, setDeckName] = useState("");
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

	/** Creates a deck when the submitted name contains usable text. */
	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const name = deckName.trim();
		if (!name) return;

		onCreateDeck(name);
		setDeckName("");
	}

	/** Renders the deck creation form and the draggable deck navigation list. */
	return (
		<aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-black/20 p-5 text-left backdrop-blur-sm md:min-h-screen md:w-72 md:border-b-0 md:border-r">
			<div className="mb-8">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
					Flashcards
				</p>
				<h1 className="mt-2 text-2xl font-semibold text-white">My decks</h1>
			</div>

			<form onSubmit={handleSubmit} className="mb-8 space-y-2">
				<label htmlFor="deck-name" className="text-sm text-white/70">
						Create deck
				</label>
				<div className="flex gap-2">
					<input
						id="deck-name"
						value={deckName}
						onChange={(event) => setDeckName(event.target.value)}
						placeholder="e.g. English"
						className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-blue-300"
					/>
					<button
						type="submit"
						className="rounded-lg bg-blue-500 px-3 py-2 text-lg font-medium text-white transition hover:bg-blue-400"
						aria-label="Create deck"
					>
						+
					</button>
				</div>
			</form>

				<nav aria-label="Existing decks" className="space-y-2">
				<p className="mb-3 text-xs uppercase tracking-wider text-white/45">
					Existing decks
				</p>
				{decks.map((deck, index) => (
					<button
						key={deck.id}
						type="button"
						draggable
						onDragStart={() => setDraggedIndex(index)}
						onDragOver={(event) => event.preventDefault()}
						onDrop={() => {
							if (draggedIndex !== null && draggedIndex !== index) {
								onReorderDecks(draggedIndex, index);
							}
							setDraggedIndex(null);
						}}
						onDragEnd={() => setDraggedIndex(null)}
						onClick={() => onSelectDeck(deck.id)}
						className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm transition ${
							deck.id === selectedDeckId
								? "bg-blue-500/20 text-blue-100 ring-1 ring-blue-300/50"
								: "text-white/70 hover:bg-white/10 hover:text-white"
						}`}
					>
						<span>{deck.name}</span>
						<span className="text-xs text-white/45">{deck.cards.length}</span>
					</button>
				))}
			</nav>
		</aside>
	);
}
