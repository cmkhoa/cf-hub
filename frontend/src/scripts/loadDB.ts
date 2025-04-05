// First install these packages:
// npm install @datastax/astra-db-ts langchain openai dotenv puppeteer
// or
// yarn add @datastax/astra-db-ts langchain openai dotenv puppeteer

import OpenAI from "openai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const {
	ASTRA_DB_APPLICATION_TOKEN,
	ASTRA_DB_API_ENDPOINT,
	ASTRA_DB_NAMESPACE,
	ASTRA_DB_COLLECTION,
	OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY,
});

// Path to the data directory
const dataDirPath = path.join(process.cwd(), "src", "data");

// Function to read all text files from the data directory
function readAllTextFiles(): string[] {
	try {
		// Check if directory exists
		if (!fs.existsSync(dataDirPath)) {
			console.error("Data directory does not exist:", dataDirPath);
			return [];
		}

		// Get all files in the directory
		const files = fs.readdirSync(dataDirPath);

		// Filter for .txt files
		const txtFiles = files.filter((file) => file.endsWith(".txt"));

		if (txtFiles.length === 0) {
			console.warn("No .txt files found in the data directory");
			return [];
		}

		console.log(`Found ${txtFiles.length} text files in the data directory`);

		// Read each file and return an array of file contents
		return txtFiles.map((file) => {
			const filePath = path.join(dataDirPath, file);
			const content = fs.readFileSync(filePath, "utf8");
			console.log(`Loaded file: ${file} (${content.length} characters)`);
			return content;
		});
	} catch (error) {
		console.error("Error reading text files:", error);
		return [];
	}
}

// Read all text files
const textFiles = readAllTextFiles();
console.log(`Loaded ${textFiles.length} text files successfully!`);

// Initialize Astra DB client
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

// Extract database
const db = client.db(ASTRA_DB_API_ENDPOINT as string, {
	namespace: ASTRA_DB_NAMESPACE,
});

// Create a text splitter
const textSplitter = new RecursiveCharacterTextSplitter({
	chunkSize: 512,
	chunkOverlap: 100,
});

// Function to create a collection
const createCollection = async (
	similarityMetric: SimilarityMetric = "dot_product"
) => {
	try {
		// Check if collection already exists
		const collections = await db.listCollections();
		const collectionExists = collections.some(
			(col) => col.name === ASTRA_DB_COLLECTION
		);

		if (collectionExists) {
			console.log(
				`Collection ${ASTRA_DB_COLLECTION} already exists. Skipping creation.`
			);
			return;
		}

		// Create collection with the correct vector dimension for text-embedding-3-large
		const res = await db.createCollection(ASTRA_DB_COLLECTION as string, {
			vector: {
				dimension: 1536, // text-embedding-3-large has 3072 dimensions
				metric: similarityMetric,
			},
		});
		console.log(`Collection created: ${ASTRA_DB_COLLECTION}`);
	} catch (error) {
		console.error("Error creating collection:", error);
	}
};

const loadSampleData = async () => {
	try {
		console.log("Loading data into database...");
		const collection = await db.collection(ASTRA_DB_COLLECTION as string);

		// Process each text file
		for (let i = 0; i < textFiles.length; i++) {
			const content = textFiles[i];
			console.log(`Processing file ${i + 1}/${textFiles.length}`);

			// Split the content into chunks
			const chunks = await textSplitter.splitText(content);
			console.log(`Split into ${chunks.length} chunks`);

			// Process each chunk
			for (let j = 0; j < chunks.length; j++) {
				const chunk = chunks[j];
				console.log(`Processing chunk ${j + 1}/${chunks.length}`);

				// Create embedding for the chunk
				const embedding = await openai.embeddings.create({
					model: "text-embedding-3-small",
					input: chunk,
					encoding_format: "float",
				});

				// Ensure the vector is properly formatted
				const vector = embedding.data[0].embedding;

				// Log vector length for debugging
				console.log(`Vector length: ${vector.length}`);

				// Insert the chunk with its embedding into the database
				await collection.insertOne({
					$vector: vector,
					text: chunk,
				});
				console.log(`Inserted chunk ${j + 1}/${chunks.length}`);
			}
		}

		console.log("All data loaded successfully!");
	} catch (error) {
		console.error("Error loading data:", error);
	}
};

// Split the text into chunks
async function splitTextIntoChunks() {
	// Combine all text files into one string
	const combinedText = textFiles.join("\n\n---\n\n");

	// Split the combined text into chunks
	const chunks = await textSplitter.splitText(combinedText);
	console.log(`Text split into ${chunks.length} chunks`);
	return chunks;
}

createCollection().then(() => loadSampleData());

