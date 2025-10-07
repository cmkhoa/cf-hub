import "./PromptSuggestionsRow.css";

const PromptSuggestionsRow = ({ onSuggestionClick }) => {
	const suggestions = [
		"Tell me about CF Hub's workshops",
		"How can I join as a mentor?",
		"What career opportunities are available?",
	];

	const handleSuggestionClick = (suggestion) => {
		if (onSuggestionClick) {
			onSuggestionClick(suggestion);
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
