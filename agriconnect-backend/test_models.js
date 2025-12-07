
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // Note: listModels might be on the client or model factory?
        // Actually, looking at docs, it's usually via API or just trying standard names.
        // The error message said: "Call ListModels to see the list of available models"
        // But the Node SDK might not expose listModels directly on the main class easily?
        // Let's try to access the model manager if available, or just testing "gemini-pro".
        // Wait, the error message from the library *said* "Call ListModels".
        // In the node SDK, it might be `genAI.getGenerativeModel`...
        // Actually, I don't recall a `listModels` method on `genAI`.
        // However, I can try `gemini-pro` which is standard.

        // Let's try to infer from the error message or documentation knowledge.
        // The error says: `models/gemini-1.5-flash-001 is not found for API version v1beta`.
        // It might be `models/gemini-1.5-flash` (without version) but that failed too.
        // Maybe `gemini-pro`?
        // I'll try to find a working model by iterating common ones.

        const modelsToTest = ["gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-1.5-pro", "gemini-pro"];
        for (const m of modelsToTest) {
            console.log(`Testing model: ${m}`);
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Hello?");
                console.log(`Success with ${m}`);
                return;
            } catch (e) {
                console.log(`Failed with ${m}: ${e.message}`);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

listModels();
