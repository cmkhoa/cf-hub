import OpenAI from "openai";
import { DataAPIClient } from "@datastax/astra-db-ts";

// Check for required environment variables
if (!process.env.OPENAI_API_KEY) {
	throw new Error("OPENAI_API_KEY is not set in environment variables");
}

if (
	!process.env.ASTRA_DB_APPLICATION_TOKEN ||
	!process.env.ASTRA_DB_API_ENDPOINT ||
	!process.env.ASTRA_DB_NAMESPACE ||
	!process.env.ASTRA_DB_COLLECTION
) {
	throw new Error(
		"One or more required Astra DB environment variables are not set"
	);
}

console.log(process.env.ASTRA_DB_APPLICATION_TOKEN);
console.log(process.env.ASTRA_DB_API_ENDPOINT);
console.log(process.env.ASTRA_DB_NAMESPACE);
console.log(process.env.ASTRA_DB_COLLECTION);
console.log(process.env.OPENAI_API_KEY);

// Initialize OpenAI API client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Astra DB client
const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);

// Get database and collection
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT, {
	namespace: process.env.ASTRA_DB_NAMESPACE,
});

// Specify runtime for better performance
export const runtime = "edge";

export async function POST(req) {
	try {
		const { messages } = await req.json();

		// Get the last user message
		const lastMessage = messages[messages?.length - 1]?.content;

		let docContext = "";

		const embedding = await openai.embeddings.create({
			model: "text-embedding-3-small",
			input: lastMessage,
			encoding_format: "float",
		});

		try {
			const collection = db.collection(process.env.ASTRA_DB_COLLECTION);
			const cursor = collection.find(null, {
				sort: {
					$vector: embedding.data[0].embedding,
				},
				limit: 10,
			});

			const documents = await cursor.toArray();

			if (Array.isArray(documents)) {
				const docsMap = documents.map((doc) => doc.text || "");
				docContext = JSON.stringify(docsMap);
			}
		} catch (error) {
			console.log("Error querying db:", error);
		}

		const template = {
			role: "system",
			content: `
				You are a helpful AI assistant for CF Hub, a mentorship platform connecting students with industry professionals.
				Use the below context to answer what you know about the CF Hub mentorship program.
				The context will provide you with the most recent page data from the CF Hub website.
				If the context doesn't include the information, you need to answer based on you existing knowledge
				and don't mention the source of you information or what the context does or doesn't include.
				Format responses using markdown where applicable and and don't return images.

				-----------
				START CONTEXT
				${docContext}
				END CONTEXT
				-----------
				QUESTION: ${lastMessage}
				-----------
			`,
		};

		// Use non-streaming response
		const response = await openai.chat.completions.create({
			model: "gpt-4",
			stream: false, // Set to false for non-streaming
			messages: [template, ...messages],
		});

		// Return the response as JSON
		return new Response(
			JSON.stringify({
				role: "assistant",
				content: response.choices[0].message.content,
			}),
			{
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (error) {
		console.error("API Error:", error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
