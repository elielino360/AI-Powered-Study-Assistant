const triviaUrl = 'https://opentdb.com/api.php?amount=5';

// Exporting the trivia question API
export async function triviaQuestion() {
  try {
    const response = await fetch(triviaUrl);

    if (!response.ok) {
      throw new Error(`There is an error with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error('No trivia question at this time');
    }

    return data.results;

  } catch (error) {
    console.log(' Failed to load trivia questions:', error.message);
    return [];
  }
}

// Exporting the OpenAI response API
export async function getAIResponse(prompt) {
  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "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", 
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No choice returned from OpenAI");
    }

    return data.choices[0].text.trim();

  } catch (error) {
    console.error(" Failed to fetch response from AI:", error.message);
    return " Unable to generate response. Please try again later.";
  }
}
