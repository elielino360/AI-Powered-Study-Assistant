import { triviaQuestion, getAIResponse } from "./api.js";

let currentIndex = 0;
let allQuestions = [];
let score = parseInt(localStorage.getItem('quizScore')) || 0;
const scoreDisplay = document.getElementById('score-display');
scoreDisplay.textContent = `Score: ${score}`;

document.addEventListener('DOMContentLoaded', async () => {
  allQuestions = await triviaQuestion();
  displayQuestion(currentIndex);

  document.getElementById('next-btn').addEventListener('click', () => {
    currentIndex++;
    if (currentIndex < allQuestions.length) {
      displayQuestion(currentIndex);
    } else {
      document.getElementById('question-text').textContent = "No more questions available.";
      document.getElementById('answer-options').innerHTML = '';
      document.getElementById('explanation-text').textContent = '';
    }
  });

  document.getElementById('reset-score').addEventListener('click', () => {
    score = 0;
    localStorage.setItem('quizScore', score);
    scoreDisplay.textContent = `Score: ${score}`;
  });
});

async function displayQuestion(index) {
  const question = allQuestions[index];
  const questionText = document.getElementById('question-text');
  const answerList = document.getElementById('answer-options');
  const explanationText = document.getElementById('explanation-text');
  const explainBtn = document.getElementById("explain-btn");

  questionText.innerHTML = decodeHTML(question.question);
  explanationText.textContent = "Click the button to get an explanation.";

  const allAnswers = [...question.incorrect_answers, question.correct_answer].sort();
  answerList.innerHTML = '';

  allAnswers.forEach(answer => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.textContent = decodeHTML(answer);
    button.classList.add('answer-option');

    button.addEventListener('click', () => {
      document.querySelectorAll('.answer-option').forEach(btn => btn.disabled = true);

      if (answer === question.correct_answer) {
        button.classList.add('correct');
        score++;
        localStorage.setItem('quizScore', score);
        scoreDisplay.textContent = `Score: ${score}`;
      } else {
        button.classList.add('wrong');
      }
    });

    li.appendChild(button);
    answerList.appendChild(li);
  });

  explainBtn.disabled = false;
  explainBtn.textContent = 'Explain Answer';

  explainBtn.onclick = async () => {
    explainBtn.disabled = true;
    explainBtn.textContent = "Explanation is loading...";
    const prompt = `Explain why "${question.correct_answer}" is the correct answer to the question: "${question.question}" in simple terms.`;

    const explanation = await getAIResponse(prompt);
    explanationText.textContent = explanation;
    explainBtn.disabled = false;
    explainBtn.textContent = 'Explain Answer';
  };
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
