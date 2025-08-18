let gameName = "Guess The Word";
document.title = gameName;

let toggleBtn = document.querySelector(".night-mode");

toggleBtn.onclick = function () {
    if (toggleBtn.classList.contains("night-mode")) {
        // Night Mode
        document.querySelector("h1").style.color = "white";
        document.querySelector("h2").style.color = "white";
        document.querySelector(".message").style.color = "white";
        document.querySelector("h1").style.backgroundColor = "#333";
        document.body.style.backgroundColor = "black";
        document.querySelectorAll(".tries span").forEach((span) => {
            span.style.color = "white";
        });
        // let btn = document.querySelector(".check");
        // if (btn.disabled) {
        //     btn.style.setProperty("background-color", "white", "important");
        // }
        toggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
        toggleBtn.className = "sun-mode";
    } else {
        // Day Mode
        document.querySelector("h1").style.color = "black";
        document.querySelector("h2").style.color = "black";
        document.querySelector("h1").style.backgroundColor = "white";
        document.body.style.backgroundColor = "#eee";
        document.querySelectorAll(".tries span").forEach((span) => {
            span.style.color = "black";
        });
        toggleBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
        toggleBtn.className = "night-mode";
    }
};


document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Made By Mostafa Sobhy`;

let NumOfTries = 5;
let NumOfLets = 6;
let CurrTry = 1;
let Hints = 3;

let wordToGuess = "";
const words = [
  "Effort", "Galaxy", "Iconic", "Laptop", "Images", "Eagles",
  "Bright", "Silent", "Wonder", "Talent", "Secret", "Future",
  "Golden", "Spirit", "Vision", "Master", "Nature", "Silver",
  "Modern", "Travel", "Friend", "Puzzle", "Simple", "Strong",
  "Planet", "Rocket", "Letter", "Animal", "Bridge", "Castle",
  "Dreams", "Forest", "Action", "Winner", "Shadow", "Energy",
  "Magnet", "Design", "Course", "Circle", "Flight", "Frozen",
  "Pretty", "Public", "Random", "Stream", "TigerS", "Window",
  "Bottle", "Candle", "Driver", "Family", "Guitar", "Honest",
  "Island", "Jungle", "Kitten", "Little", "Mobile", "Number",
  "Orange", "Pirate", "Quiver", "Rabbit", "School", "Travel",
  "United", "Velvet", "Writer", "Yellow", "Zebras"
];
const randomIdx = Math.floor(Math.random() * words.length);
wordToGuess = words[randomIdx];
let messageArea = document.querySelector(".message");

let hintNums = document.querySelector(".hintNums");
hintNums.innerHTML = Hints;
const getHintsButtons = document.querySelector(".hints");
getHintsButtons.addEventListener("click", getHinit);

let game_area = document.querySelector(".game-area .tries"); 

function generateInputs() {
    for (let i = 0; i < NumOfTries; i++) {
        let span = document.createElement("span");
        span.className = `try${i+1}`;
        if (i !== 0) {
            span.classList.add("disabled-inputs")
        }
        span.appendChild(document.createTextNode(`Try${i+1}`));
        for (let j = 0; j < NumOfLets; j++) {
            let input = document.createElement("input");
            input.id = `guess-${i+1}-letter-${j+1}`
            input.setAttribute("maxlength", "1");
            span.appendChild(input);
        }
        game_area.appendChild(span);
    }
    game_area.children[0].children[0].focus();

    const inputInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    inputInDisabledDiv.forEach((el) => (el.disabled = true));

    const inputs = document.querySelectorAll("input"); 
    inputs.forEach((input, idx) => {
        input.addEventListener("input", function() {
            this.value = this.value.toUpperCase();

            let nextIdx = idx + 1;
            while(nextIdx < inputs.length && inputs[nextIdx].value !== "") {
                nextIdx++;
            }

            if(nextIdx < inputs.length) {
                inputs[nextIdx].focus();
            }
        });

        input.addEventListener("keydown", function(event) {
            const currentTryInputs = Array.from(document.querySelectorAll(`.try${CurrTry} input`));
            const currentIdx = currentTryInputs.indexOf(event.target);

            if (event.key === "ArrowRight") {
                const nextInput = currentIdx + 1;
                if (nextInput < currentTryInputs.length) currentTryInputs[nextInput].focus();
            }

            if (event.key === "ArrowLeft") {
                const prevInput = currentIdx - 1;
                if (prevInput >= 0) currentTryInputs[prevInput].focus();
            }

            if (event.key === "Backspace") {
                if (event.target.value === "") {
                    const prevInput = currentIdx - 1;
                    if (prevInput >= 0) {
                        currentTryInputs[prevInput].value = "";
                        currentTryInputs[prevInput].focus();
                    }
                } else {
                    event.target.value = "";
                }
            }
        });

    })
}

const GuessButton = document.querySelector(".check");
GuessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
    let successGuess = true;
    for (let i = 1; i <= NumOfLets; i++) {
        const inputField = document.querySelector(`#guess-${CurrTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1].toLowerCase();
        if (letter === actualLetter) {
            inputField.classList.add("yes-in-place");
        } else if (wordToGuess.includes(letter) && (letter !== "" || letter !== " ")) {
            inputField.classList.add("not-in-place");
            successGuess = false;
        } else if (letter === "" || letter === " ") {
            inputField.classList.add("space");
            successGuess = false;
        } else {
            inputField.classList.add("no");
            successGuess = false;
        }  
    }

    if (successGuess) {
        const successSound = new Audio("sounds/win.mp3");
        messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;
        successSound.play();
        let buttons = document.querySelectorAll(".tries > span");
        buttons.forEach((butt) => (butt.classList.add("disabled-inputs")));
        GuessButton.disabled = true;
    } else {
        const currentTryEl = document.querySelector(`.try${CurrTry}`);
        if (currentTryEl) {
            currentTryEl.classList.add("disabled-inputs");
            const currentInputsEl = document.querySelectorAll(`.try${CurrTry} input`);
            currentInputsEl.forEach((inp) => (inp.disabled = true));
        }

        CurrTry++;

        const nextTryEl = document.querySelector(`.try${CurrTry}`);
        if (nextTryEl) {
            nextTryEl.classList.remove("disabled-inputs");
            nextTryEl.querySelectorAll("input").forEach(inp => inp.removeAttribute("disabled"));
            game_area.children[CurrTry - 1].children[0].focus();
        } else {
            const failSound = new Audio("sounds/lose.mp3");
            messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
            GuessButton.disabled = true;
            failSound.play();
        }
    }

}

function getHinit() {
    if (Hints > 0) {
        Hints--;
        hintNums.innerHTML = Hints;
    }
    if (Hints === 0) {
        getHintsButtons.disabled = true;
    }
    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    
    const emptyEnpledInputs = Array.from(enabledInputs).filter((input) => (input.value === ""));

    if (emptyEnpledInputs.length > 0) {
        const randomIdx = Math.floor(Math.random() * emptyEnpledInputs.length);
        const randomInput = emptyEnpledInputs[randomIdx];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        if (indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
        console.log(indexToFill);
    }
}

window.onload = generateInputs;

