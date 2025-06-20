// api.js

// Fetch trivia questions from Open Trivia DB
export async function triviaQuestion() {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");

    if (!response.ok) {
      throw new Error(`❌ Failed to fetch questions. Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("❌ No trivia questions received.");
    }

    return data.results;

  } catch (error) {
    console.error("⚠️ Trivia Error:", error.message);
    return [];
  }
}

// Send question to Hugging Face backend for explanation
export async function getAIResponse(prompt) {
  try {
    const response = await fetch("http://localhost:3000/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`❌ AI Error: Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.generated_text) {
      throw new Error("❌ No explanation returned.");
    }

    return data.generated_text;

  } catch (error) {
    console.error("❌ AI Error:", error.message);
    return "⚠️ Unable to get AI explanation. Try again later.";
  }
}
