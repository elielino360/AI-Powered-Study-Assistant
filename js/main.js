import { triviaQuestion, getAIResponse } from "./api.js";

document.addEventListener('DOMContentLoaded', async () => {
  const questions = await triviaQuestion();

  if (questions.length > 0) {
    const firstQuestion = questions[0];

    // Display question
    const questionText = document.getElementById('question-text');
    questionText.innerHTML = firstQuestion.question;

    // Display answers
    const answerList = document.getElementById('answer-options');
    const allAnswers = [...firstQuestion.incorrect_answers, firstQuestion.correct_answer].sort();

    answerList.innerHTML = '';
    allAnswers.forEach(answer => {
      const li = document.createElement('li');
      li.textContent = answer;
      answerList.appendChild(li);
    });

    // Button logic
    const explainBtn = document.getElementById("explain-btn");
    const explanationText = document.getElementById("explanation-text");

    explainBtn.addEventListener('click', async () => {
      explainBtn.disabled = true;
      explainBtn.textContent = "Explanation is loading...";

      const prompt = `Explain why "${firstQuestion.correct_answer}" is the correct answer to the question: "${firstQuestion.question}" in simple terms.`;

      const explanation = await getAIResponse(prompt);
      explanationText.textContent = explanation;

      explainBtn.disabled = false;
      explainBtn.textContent = 'Explain Answer';
    });

  } else {
    document.getElementById('question-text').textContent = "No question available.";
  }
});
