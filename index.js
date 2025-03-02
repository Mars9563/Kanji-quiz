let kanjiData = [];

// Load JSON data
fetch("kanji_data.json")
    .then(response => response.json())
    .then(data => {
        kanjiData = data;
    })
    .catch(error => console.error("Error loading kanji data:", error));

let selectedKanji = []; // Store selected questions

// Function to start the quiz
function startQuiz() {
    let level = document.getElementById("levelSelect").value;
    let questionCount = parseInt(document.getElementById("questionCount").value);

    let filteredKanji = kanjiData.filter(k => {
        if (level === "N5N4") return k.jlpt === 5 || k.jlpt === 4;
        if (level === "N3") return k.jlpt === 3;
        if (level === "N2") return k.jlpt === 2;
        if (level === "N1") return k.jlpt === 1;
        return false;
    });

    if (filteredKanji.length < questionCount) {
        alert("Not enough kanji available for the selected level!");
        return;
    }

    selectedKanji = getRandomItems(filteredKanji, questionCount);
    generateQuiz(selectedKanji);
}

// Function to generate quiz questions
function generateQuiz(kanjiList) {
    let quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = "";

    kanjiList.forEach((kanji, index) => {
        let correctMeaning = kanji.meanings[0];
        let allMeanings = getRandomItems(
            kanjiData.flatMap(k => k.meanings), // Get all meanings
            3
        );
        allMeanings.push(correctMeaning);
        allMeanings = shuffleArray(allMeanings);

        let questionDiv = document.createElement("div");
        questionDiv.classList.add("quiz-card"); // Bootstrap Card Styling
        questionDiv.innerHTML = `
            <div class="card p-3 mb-3">
                <h5 class="card-title text-center">${index + 1}. ${kanji.literal}</h5>
                <div class="options">
                    ${allMeanings
                        .map(
                            (m, i) => `
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="q${index}" value="${m}" id="q${index}-${i}">
                            <label class="form-check-label" for="q${index}-${i}">${m}</label>
                        </div>`
                        )
                        .join("")}
                </div>
            </div>
        `;
        quizContainer.appendChild(questionDiv);
    });

    document.getElementById("submitQuiz").style.display = "block"; // Show Submit Button
}

// Function to submit quiz and evaluate answers
function submitQuiz() {
    let score = 0;
    selectedKanji.forEach((kanji, index) => {
        let selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
        let correctAnswer = kanji.meanings[0];

        if (selectedOption) {
            if (selectedOption.value === correctAnswer) {
                score++;
                selectedOption.parentElement.style.color = "green"; // Highlight Correct
            } else {
                selectedOption.parentElement.style.color = "red"; // Highlight Wrong
                // Highlight correct answer
                document
                    .querySelectorAll(`input[name="q${index}"]`)
                    .forEach(option => {
                        if (option.value === correctAnswer) {
                            option.parentElement.style.color = "blue"; // Mark correct answer in blue
                        }
                    });
            }
        }
    });

    // Display Result
    document.getElementById("result").innerHTML = `<h3>You scored ${score} / ${selectedKanji.length}</h3>`;
}

// Function to get random items from an array
function getRandomItems(arr, num) {
    let shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

// Function to shuffle an array
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Attach event listeners
document.getElementById("startQuiz").addEventListener("click", startQuiz);
document.getElementById("submitQuiz").addEventListener("click", submitQuiz);
