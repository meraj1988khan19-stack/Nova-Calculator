/* =====================================================
   NOVA CALCULATOR
===================================================== */


/* =========================
   ELEMENTS
========================= */

const result = document.getElementById("result");
const expression = document.getElementById("expression");
const statusText = document.getElementById("status");

const memoryIndicator =
    document.getElementById("memoryIndicator");

const answerPreview =
    document.getElementById("answerPreview");

const scientificPanel =
    document.getElementById("scientific");

const historyPanel =
    document.getElementById("historyPanel");

const historyList =
    document.getElementById("historyList");

const angleBtn =
    document.getElementById("angleBtn");


/* =========================
   STATE
========================= */

let current = "0";

let stored = null;

let operator = null;

let waitingForNumber = false;

let memory = 0;

let angleMode = "DEG";

let history = [];


/* =========================
   DISPLAY
========================= */

function updateDisplay() {

    result.textContent = current;


    if (
        stored !== null &&
        operator !== null
    ) {

        expression.textContent =
            formatNumber(stored) +
            " " +
            operator;

    } else {

        expression.textContent = "";

    }


    memoryIndicator.textContent =
        memory !== 0 ? "M" : "";


    document.getElementById(
        "modeIndicator"
    ).textContent = angleMode;


    if (memory !== 0) {

        statusText.textContent =
            "Memory active";

    } else {

        statusText.textContent =
            "Ready";

    }
}


/* =========================
   NUMBERS
========================= */

function inputNumber(number) {

    if (current === "Error") {

        clearAll();

    }


    if (waitingForNumber) {

        current = number;

        waitingForNumber = false;

    } else {

        if (current === "0") {

            current = number;

        } else {

            current += number;

        }

    }


    updateDisplay();
}


/* =========================
   DECIMAL
========================= */

function inputDecimal() {

    if (waitingForNumber) {

        current = "0.";

        waitingForNumber = false;

        updateDisplay();

        return;
    }


    if (!current.includes(".")) {

        current += ".";

    }


    updateDisplay();
}


/* =========================
   OPERATOR
========================= */

function chooseOperator(nextOperator) {

    const inputValue =
        parseFloat(current);


    if (isNaN(inputValue)) {

        return;

    }


    if (
        operator !== null &&
        waitingForNumber
    ) {

        operator = nextOperator;

        updateDisplay();

        return;
    }


    if (stored === null) {

        stored = inputValue;

    } else if (operator !== null) {

        const calculated =
            performCalculation(
                stored,
                inputValue,
                operator
            );


        if (calculated === null) {

            return;

        }


        stored = calculated;

        current =
            formatNumber(calculated);

    }


    operator = nextOperator;

    waitingForNumber = true;

    updateDisplay();
}


/* =========================
   CALCULATE
========================= */

function calculate() {

    if (
        operator === null ||
        stored === null
    ) {

        return;

    }


    const inputValue =
        parseFloat(current);


    if (isNaN(inputValue)) {

        return;

    }


    const first = stored;

    const op = operator;

    const second = inputValue;


    const calculated =
        performCalculation(
            first,
            second,
            op
        );


    if (calculated === null) {

        return;

    }


    const calculationText =
        formatNumber(first) +
        " " +
        op +
        " " +
        formatNumber(second);


    const answerText =
        formatNumber(calculated);


    addHistory(
        calculationText,
        answerText
    );


    current = answerText;

    stored = null;

    operator = null;

    waitingForNumber = true;

    answerPreview.textContent =
        "Answer";


    updateDisplay();
}


/* =========================
   MATH ENGINE
========================= */

function performCalculation(a, b, op) {

    let value;


    switch (op) {

        case "+":

            value = a + b;

            break;


        case "−":

            value = a - b;

            break;


        case "×":

            value = a * b;

            break;


        case "÷":

            if (b === 0) {

                showError(
                    "Cannot divide by zero"
                );

                return null;

            }

            value = a / b;

            break;


        default:

            value = b;

    }


    return value;
}


/* =========================
   CLEAR
========================= */

function clearAll() {

    current = "0";

    stored = null;

    operator = null;

    waitingForNumber = false;

    answerPreview.textContent = "";

    statusText.textContent = "Ready";

    updateDisplay();
}


/* =========================
   BACKSPACE
========================= */

function backspace() {

    if (
        waitingForNumber ||
        current === "Error"
    ) {

        return;

    }


    if (current.length <= 1) {

        current = "0";

    } else {

        current =
            current.slice(0, -1);

    }


    updateDisplay();
}


/* =========================
   SIGN
========================= */

function changeSign() {

    if (
        current === "0" ||
        current === "Error"
    ) {

        return;

    }


    if (current.startsWith("-")) {

        current =
            current.slice(1);

    } else {

        current =
            "-" + current;

    }


    updateDisplay();
}


/* =========================
   PERCENT
========================= */

function percentage() {

    const number =
        parseFloat(current);


    if (isNaN(number)) {

        return;

    }


    current =
        formatNumber(number / 100);


    updateDisplay();
}


/* =========================
   SCIENTIFIC
========================= */

function scientificFunction(type) {

    let number =
        parseFloat(current);


    if (isNaN(number)) {

        return;

    }


    let value;


    switch (type) {

        case "sin":

            value =
                Math.sin(
                    toRadians(number)
                );

            break;


        case "cos":

            value =
                Math.cos(
                    toRadians(number)
                );

            break;


        case "tan":

            value =
                Math.tan(
                    toRadians(number)
                );

            break;


        case "log":

            if (number <= 0) {

                showError(
                    "Invalid logarithm"
                );

                return;

            }

            value =
                Math.log10(number);

            break;


        case "ln":

            if (number <= 0) {

                showError(
                    "Invalid logarithm"
                );

                return;

            }

            value =
                Math.log(number);

            break;


        case "sqrt":

            if (number < 0) {

                showError(
                    "Invalid square root"
                );

                return;

            }

            value =
                Math.sqrt(number);

            break;


        case "square":

            value =
                number * number;

            break;


        case "inverse":

            if (number === 0) {

                showError(
                    "Cannot divide by zero"
                );

                return;

            }

            value =
                1 / number;

            break;


        case "factorial":

            if (
                number < 0 ||
                !Number.isInteger(number) ||
                number > 170
            ) {

                showError(
                    "Invalid factorial"
                );

                return;

            }

            value =
                factorial(number);

            break;


        case "pi":

            value = Math.PI;

            break;


        case "e":

            value = Math.E;

            break;


        default:

            return;
    }


    const oldValue = current;


    current =
        formatNumber(value);


    addHistory(
        type + "(" + oldValue + ")",
        current
    );


    waitingForNumber = false;

    updateDisplay();
}


/* =========================
   FACTORIAL
========================= */

function factorial(number) {

    let answer = 1;


    for (
        let i = 2;
        i <= number;
        i++
    ) {

        answer *= i;

    }


    return answer;
}


/* =========================
   ANGLE MODE
========================= */

function toRadians(number) {

    if (angleMode === "RAD") {

        return number;

    }


    return (
        number * Math.PI / 180
    );
}


angleBtn.addEventListener(
    "click",
    function () {

        angleMode =
            angleMode === "DEG"
                ? "RAD"
                : "DEG";


        angleBtn.textContent =
            angleMode;


        updateDisplay();

    }
);


/* =========================
   MEMORY
========================= */

function memoryAction(action) {

    const value =
        parseFloat(current);


    switch (action) {

        case "MC":

            memory = 0;

            break;


        case "MR":

            current =
                formatNumber(memory);

            waitingForNumber = false;

            break;


        case "M+":

            if (!isNaN(value)) {

                memory += value;

            }

            break;


        case "M-":

            if (!isNaN(value)) {

                memory -= value;

            }

            break;

    }


    updateDisplay();
}


/* =========================
   HISTORY
========================= */

function addHistory(
    expressionText,
    resultText
) {

    history.unshift({

        expression: expressionText,

        result: resultText

    });


    if (history.length > 30) {

        history.pop();

    }


    saveHistory();

    renderHistory();
}


function renderHistory() {

    if (history.length === 0) {

        historyList.innerHTML = `
            <div class="empty-history">
                <span>⌁</span>
                <p>No calculations yet</p>
            </div>
        `;

        return;
    }


    historyList.innerHTML = "";


    history.forEach(
        function (item) {

            const div =
                document.createElement("div");


            div.className =
                "history-item";


            div.innerHTML = `
                <div class="history-expression">
                    ${escapeHTML(item.expression)}
                </div>

                <div class="history-result">
                    = ${escapeHTML(item.result)}
                </div>
            `;


            div.addEventListener(
                "click",
                function () {

                    current =
                        item.result;

                    waitingForNumber =
                        false;

                    closeHistory();

                    updateDisplay();

                }
            );


            historyList.appendChild(div);

        }
    );
}


/* =========================
   HISTORY STORAGE
========================= */

function saveHistory() {

    localStorage.setItem(
        "nova-history",
        JSON.stringify(history)
    );
}


function loadHistory() {

    try {

        const saved =
            localStorage.getItem(
                "nova-history"
            );


        if (saved) {

            history =
                JSON.parse(saved);

        }

    } catch (error) {

        history = [];

    }


    renderHistory();
}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================
   HISTORY PANEL
========================= */

function openHistory() {

    historyPanel.classList.add(
        "open"
    );

}


function closeHistory() {

    historyPanel.classList.remove(
        "open"
    );

}


document
    .getElementById("historyBtn")
    .addEventListener(
        "click",
        openHistory
    );


document
    .getElementById("closeHistory")
    .addEventListener(
        "click",
        closeHistory
    );


document
    .getElementById("clearHistory")
    .addEventListener(
        "click",
        function () {

            history = [];

            saveHistory();

            renderHistory();

        }
    );


/* =========================
   SCIENTIFIC TOGGLE
========================= */

document
    .getElementById("scientificToggle")
    .addEventListener(
        "click",
        function () {

            scientificPanel.classList.toggle(
                "open"
            );

        }
    );


/* =========================
   THEME
========================= */

document
    .getElementById("themeBtn")
    .addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "light"
            );


            const isLight =
                document.body.classList.contains(
                    "light"
                );


            localStorage.setItem(
                "nova-theme",
                isLight
                    ? "light"
                    : "dark"
            );

        }
    );


/* Load saved theme */

if (
    localStorage.getItem(
        "nova-theme"
    ) === "light"
) {

    document.body.classList.add(
        "light"
    );

}


/* =========================
   NORMAL BUTTONS
========================= */

document
    .querySelectorAll("[data-value]")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    inputNumber(
                        button.dataset.value
                    );

                }
            );

        }
    );


/* =========================
   OPERATORS
========================= */

document
    .querySelectorAll(
        '.keypad [data-value="+"] , ' +
        '.keypad [data-value="−"] , ' +
        '.keypad [data-value="×"] , ' +
        '.keypad [data-value="÷"]'
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    chooseOperator(
                        button.dataset.value
                    );

                }
            );

        }
    );


/* =========================
   ACTION BUTTONS
========================= */

document
    .querySelectorAll("[data-action]")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const action =
                        button.dataset.action;


                    switch (action) {

                        case "clear":

                            clearAll();

                            break;


                        case "backspace":

                            backspace();

                            break;


                        case "percent":

                            percentage();

                            break;


                        case "sign":

                            changeSign();

                            break;


                        case "decimal":

                            inputDecimal();

                            break;


                        case "calculate":

                            calculate();

                            break;

                    }

                }
            );

        }
    );


/* =========================
   SCIENTIFIC BUTTONS
========================= */

document
    .querySelectorAll(
        "[data-scientific]"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    scientificFunction(
                        button.dataset.scientific
                    );

                }
            );

        }
    );


/* =========================
   MEMORY BUTTONS
========================= */

document
    .querySelectorAll(
        "[data-memory]"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    memoryAction(
                        button.dataset.memory
                    );

                }
            );

        }
    );


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        const key = event.key;


        /* Numbers */

        if (/^[0-9]$/.test(key)) {

            inputNumber(key);

            return;
        }


        switch (key) {

            case ".":

                inputDecimal();

                break;


            case "+":

                chooseOperator("+");

                break;


            case "-":

                chooseOperator("−");

                break;


            case "*":

                chooseOperator("×");

                break;


            case "/":

                event.preventDefault();

                chooseOperator("÷");

                break;


            case "%":

                percentage();

                break;


            case "Enter":

            case "=":

                calculate();

                break;


            case "Backspace":

                backspace();

                break;


            case "Escape":

                clearAll();

                closeHistory();

                break;

        }

    }
);


/* =========================
   ERROR
========================= */

function showError(message) {

    current = "Error";

    statusText.textContent =
        message;


    updateDisplay();


    setTimeout(
        function () {

            if (current === "Error") {

                current = "0";

                statusText.textContent =
                    "Ready";

                updateDisplay();

            }

        },
        1500
    );
}


/* =========================
   FORMAT NUMBER
========================= */

function formatNumber(number) {

    if (!Number.isFinite(number)) {

        return "Error";

    }


    const rounded =
        Number(
            Number(number).toPrecision(12)
        );


    return rounded.toString();
}


/* =========================
   START
========================= */

loadHistory();

updateDisplay();