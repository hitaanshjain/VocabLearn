import { generatePOS } from "./llmapi.js";
const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";


 const normalizeData = async (word, data) => {
    const meanings = data[0].meanings;
    const pos = await generatePOS(word);
    const definitions = data[0].meanings.flatMap(m =>
        m.definitions.map(d => d.definition)
      );

    console.log(pos);
    return {
        word: word,
        partOfSpeech: pos,
        definitions: definitions,
        correctCount: 0,
        totalTested: 0
    }
}

export const lookupWord = async (word) => {
    const res = await fetch(`${BASE_URL}/${encodeURIComponent(word.trim())}`);
  
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Dictionary API error: ${res.status}`);
  
    const data = await res.json();
   
    return await normalizeData(word, data);
  };