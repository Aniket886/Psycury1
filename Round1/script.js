const questions = [
    { question: "What is the capital of France?", options: ["Madrid", "Berlin", "Paris", "Rome"], correct: 2 },
            { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
            { question: "Who wrote 'Hamlet'?", options: ["Charles Dickens", "Mark Twain", "William Shakespeare", "Jane Austen"], correct: 2 },
            { question: "What is the boiling point of water?", options: ["90°C", "100°C", "110°C", "120°C"], correct: 1 },
            { question: "Which element has the chemical symbol 'O'?", options: ["Oxygen", "Osmium", "Gold", "Iron"], correct: 0 },
            { question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"], correct: 2 },
            { question: "What is the square root of 64?", options: ["6", "8", "10", "12"], correct: 1 },
            { question: "What is the largest ocean?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: 2 },
            { question: "Who was the first U.S. President?", options: ["Washington", "Lincoln", "Jefferson", "Adams"], correct: 0 },
            { question: "What is the chemical formula for water?", options: ["CO2", "H2O", "NaCl", "CH4"], correct: 1 },
            { question: "Which animal is the 'King of the Jungle'?", options: ["Tiger", "Elephant", "Lion", "Gorilla"], correct: 2 },
            { question: "What is the main ingredient in guacamole?", options: ["Tomato", "Avocado", "Onion", "Garlic"], correct: 1 },
            { question: "Which organ pumps blood?", options: ["Brain", "Heart", "Liver", "Lungs"], correct: 1 },
            { question: "Who discovered gravity?", options: ["Newton", "Einstein", "Galileo", "Hawking"], correct: 0 },
            { question: "What is the largest planet in our solar system?", options: ["Earth", "Mars", "Jupiter", "Saturn"], correct: 2 },
];

const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
let currentQuestionIndex = 0;
let correctAnswers = 0;

const questionContainer = document.getElementById('question-container');
const nextButton = document.getElementById('next-button');
const submitButton = document.getElementById('submit-button');
const messageContainer = document.getElementById('message-container');

function showQuestion(index) {
    const q = shuffledQuestions[index];
    questionContainer.innerHTML =
        `<div class="question">
            <p><strong>${index + 1}. ${q.question}</strong></p>
            <ul class="options">
                ${q.options.map((opt, i) => 
                    `<li>
                        <label>
                            <input type="radio" name="question" value="${i}"> ${opt}
                        </label>
                    </li>`
                ).join('')}
            </ul>
        </div>`;
    messageContainer.textContent = ""; // Clear any previous error message
}

nextButton.addEventListener('click', () => {
    const selectedOption = document.querySelector('input[name="question"]:checked');
    if (!selectedOption) {
        messageContainer.textContent = "Please select an option before proceeding.";
        messageContainer.className = "error";
        return;
    }

    if (parseInt(selectedOption.value) === shuffledQuestions[currentQuestionIndex].correct) {
        correctAnswers++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion(currentQuestionIndex);
    }
    if (currentQuestionIndex === shuffledQuestions.length - 1) {
        nextButton.style.display = "none";
        submitButton.style.display = "block";
    }
});

submitButton.addEventListener('click', () => {
    const totalQuestions = shuffledQuestions.length;
    const wrongAnswers = totalQuestions - correctAnswers;

    questionContainer.innerHTML =
        `<div class="summary">
            <p style="color: bright green;">Correct Answers: ${correctAnswers}</p>
            <p style="color: bright red;">Wrong Answers: ${wrongAnswers}</p>
        </div>`;

    if (correctAnswers >= 10) {
        messageContainer.textContent = "Congratulations! You're proceeding to the next round!";
        messageContainer.className = "success";
        setTimeout(() => window.location.href = "Round2/round2.html", 2000);
    } else {
        messageContainer.textContent = "Better luck next time!";
        messageContainer.className = "error";
    }
});

// Clear error message on option selection
questionContainer.addEventListener('change', () => {
    messageContainer.textContent = "";
    messageContainer.className = "";
});

showQuestion(currentQuestionIndex);
