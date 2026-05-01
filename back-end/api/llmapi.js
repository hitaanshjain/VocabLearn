import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generatePOS = async (word) => {
    const prompt = `What is the part of speech for the word "${word}"? Respond with only the part of speech, no explanation.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().toLowerCase();
    return text || 'unknown';
};

export const handleReverseDict = async (query, candidates = []) => {
    const prompt = `You are a reverse dictionary assistant for VocabLearn. Your job is to take a query and a list of candidate words, and determine if any of the candidates match the query. 
                    The query is a description regarding what word the user is trying to find, and the candidates are possible words that could fit that description.
                    Query: "${query}"
                    Candidate words: ${candidates.join(', ')}
                    Return ONLY valid JSON in this shape:
                    {
                    "status": "match" | "no_match",
                    "word": "<best candidate word or null>",
                    "suggestion": "<single-word suggestion or null>"
                    }
                    Rules:
                    - If a candidate fits, set status="match", word="<candidate>", suggestion=null.
                    - If none fit, set status="no_match", word=null, suggestion="<single word>".
                    - No extra text, no markdown, no explanations.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    try {
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini returned invalid JSON:", text);
        throw new Error("Failed to parse LLM response", { cause: error });
    }


};