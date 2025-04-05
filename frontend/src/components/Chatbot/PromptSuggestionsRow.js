import "./PromptSuggestionsRow.css";

const PromptSuggestionsRow = ({}) => {
	const suggestions = [
		"Tell me about CF Hub's workshops",
		"How can I join as a mentor?",
		"What career opportunities are available?",
	];

	const handleSuggestionClick = (suggestion) => {
		const input = document.querySelector(".chat-input");
		if (input) {
			// Create a new input event
			const inputEvent = new Event("input", { bubbles: true });
			// Set the value
			input.value = suggestion;
			// Dispatch the event
			input.dispatchEvent(inputEvent);

			// Focus the input after selecting a suggestion
			input.focus();
		}
	};

	return (
		<div className="prompt-suggestions">
			{suggestions.map((suggestion, index) => (
				<button
					key={index}
					className="suggestion-button"
					onClick={() => handleSuggestionClick(suggestion)}
				>
					{suggestion}
				</button>
			))}
		</div>
	);
};

export default PromptSuggestionsRow;
