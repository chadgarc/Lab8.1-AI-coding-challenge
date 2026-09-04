import { useEffect, useState, type FormEvent } from "react";
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
 * Supports a responsive mobile drawer toggled via DaisyUI swap button.
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
	const [isOpen, setIsOpen] = useState(false);

	// Close the drawer with the Escape key
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape" && isOpen) {
				setIsOpen(false);
			}
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen]);

	/** Creates a deck when the submitted name contains usable text. */
	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const name = deckName.trim();
		if (!name) return;

		onCreateDeck(name);
		setDeckName("");
		setIsOpen(false);
	}

	/** Renders the deck creation form, draggable list, and mobile drawer toggle. */
	return (
		<>
			{/* Mobile sticky hamburger button when menu is closed */}
			{!isOpen && (
				<div className="fixed top-4 left-4 z-30 self-start p-4 lg:hidden">
					<label
						className="btn btn-circle swap swap-rotate border border-white/15 bg-black/60 text-white shadow-xl backdrop-blur hover:bg-black/80"
						title="Open decks menu"
					>
						<input
							type="checkbox"
							checked={isOpen}
							onChange={(event) => setIsOpen(event.target.checked)}
							aria-label="Open menu"
						/>
						{/* Hamburger icon */}
						<svg
							className="swap-off fill-current"
							xmlns="http://www.w3.org/2000/svg"
							width="28"
							height="28"
							viewBox="0 0 512 512"
						>
							<path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
						</svg>
						{/* Close icon */}
						<svg
							className="swap-on fill-current"
							xmlns="http://www.w3.org/2000/svg"
							width="28"
							height="28"
							viewBox="0 0 512 512"
						>
							<polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
						</svg>
					</label>
				</div>
			)}

			{/* Backdrop overlay on mobile when drawer is open */}
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
					onClick={() => setIsOpen(false)}
					aria-hidden="true"
				/>
			)}

			{/* Sidebar drawer */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] max-h-[100dvh] w-72 max-w-[85vw] flex-col overflow-hidden border-r border-white/10 bg-[#161618] p-5 text-left shadow-2xl backdrop-blur-md transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:h-auto lg:max-h-none lg:min-h-screen lg:w-72 lg:translate-x-0 lg:overflow-visible lg:border-b-0 lg:bg-black/20 lg:shadow-none ${
					isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
				}`}
			>
				<div className="mb-6 flex shrink-0 items-start justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
							Flashcards
						</p>
						<h1 className="mt-2 text-2xl font-semibold text-white">My decks</h1>
					</div>

					{/* Close swap button on top right of the menu when open on mobile */}
					<label
						className="btn btn-circle btn-sm swap swap-rotate border border-white/15 bg-black/40 text-white lg:hidden"
						title="Close decks menu"
					>
						<input
							type="checkbox"
							checked={isOpen}
							onChange={(event) => setIsOpen(event.target.checked)}
							aria-label="Close menu"
						/>
						{/* Hamburger icon */}
						<svg
							className="swap-off fill-current"
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 512 512"
						>
							<path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
						</svg>
						{/* Close icon */}
						<svg
							className="swap-on fill-current"
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 512 512"
						>
							<polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
						</svg>
					</label>
				</div>

				<form onSubmit={handleSubmit} className="mb-6 shrink-0 space-y-2">
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

				<div className="flex min-h-0 flex-1 flex-col">
					<p className="mb-3 shrink-0 text-xs uppercase tracking-wider text-white/45">
						Existing decks
					</p>
					<nav
						aria-label="Existing decks"
						style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
						className="flex-1 space-y-2 overflow-y-auto overscroll-contain pr-1 touch-pan-y"
					>
						{decks.map((deck, index) => (
							<button
								key={deck.id}
								type="button"
								draggable
								style={{ touchAction: "pan-y" }}
								onDragStart={() => setDraggedIndex(index)}
								onDragOver={(event) => event.preventDefault()}
								onDrop={() => {
									if (draggedIndex !== null && draggedIndex !== index) {
										onReorderDecks(draggedIndex, index);
									}
									setDraggedIndex(null);
								}}
								onDragEnd={() => setDraggedIndex(null)}
								onClick={() => {
									onSelectDeck(deck.id);
									setIsOpen(false);
								}}
								className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm touch-pan-y transition ${
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
				</div>
			</aside>
		</>
	);
}
