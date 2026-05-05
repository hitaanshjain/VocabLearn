const BASE_URL = "https://freedictionaryapi.com/api/v1/entries/en";


 const normalizeData = async (word, data) => {
    const pos = data.entries[0].partOfSpeech;
    const definitions = data.entries.flatMap(entry =>
      entry.senses
        .map(sense => sense.definition)
    );

    console.log(pos);
    return {
        word: word,
        partOfSpeech: pos,
        definitions: definitions,
        correctCount: 0,
        totalTested: 0
    };
};

export const lookupWord = async (word) => {
    const res = await fetch(`${BASE_URL}/${encodeURIComponent(word.trim())}`);
  
    if (res.status === 404) {return null;}
    if (!res.ok) {throw new Error(`Dictionary API error: ${res.status}`);}
  
    const data = await res.json();
   
    return await normalizeData(word, data);
  };