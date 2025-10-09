import "./PromptSuggestionsRow.css";

const DEFAULT_SUGGESTIONS = [
	"Tell me about CF Hub's workshops",
	"How can I join as a mentor?",
	"What career opportunities are available?",
];

const PromptSuggestionsRow = ({ onSuggestionClick, suggestions }) => {
	const list = Array.isArray(suggestions) && suggestions.length > 0 ? suggestions : DEFAULT_SUGGESTIONS;

	const handleSuggestionClick = (suggestion) => {
		if (onSuggestionClick) {
			onSuggestionClick(suggestion);
		}
	};

	return (
		<div className="prompt-suggestions">
			{list.map((suggestion, index) => (
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
