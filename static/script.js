const input = document.getElementById("input");
const result = document.getElementById("result");
const loading = document.getElementById("loading");
const run = document.getElementById("run");
const clear = document.getElementById("clear");
const level = document.getElementById("level");
const theme = document.getElementById("theme");
const kicker = document.getElementById("kicker");
const title = document.getElementById("title");

/* =========================================================
   TOOL CONFIGURATION
========================================================= */

const tools = {
    qa: {
        kicker: "ASK ANYTHING",
        title: "What would you like to learn?",
        placeholder: "Ask a question or enter a topic..."
    },

    explain: {
        kicker: "EXPLAIN IT",
        title: "Let's simplify something complex.",
        placeholder: "Enter a concept you want explained..."
    },

    quiz: {
        kicker: "GENERATE QUIZ",
        title: "Test your knowledge.",
        placeholder: "Enter a topic for your quiz..."
    },

    summarize: {
        kicker: "SUMMARIZE",
        title: "Turn your notes into revision material.",
        placeholder: "Paste your notes here..."
    },

    learn: {
        kicker: "LEARNING PATH",
        title: "Build your path from beginner to advanced.",
        placeholder: "Enter a topic you want to master..."
    }
};

let currentTask = "qa";

/* =========================================================
   TOOL BUTTONS
========================================================= */

document.querySelectorAll(".tool").forEach((button) => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".tool").forEach((b) => {
            b.classList.remove("active");
        });

        button.classList.add("active");

        currentTask = button.dataset.task;

        const config = tools[currentTask];

        kicker.textContent = config.kicker;
        title.textContent = config.title;
        input.placeholder = config.placeholder;

        result.classList.add("hidden");
        result.innerHTML = "";
    });
});

/* =========================================================
   EXAMPLE CHIPS
========================================================= */

document.querySelectorAll(".chips button").forEach((button) => {

    button.addEventListener("click", () => {

        input.value = button.dataset.fill;

        input.focus();
    });
});

/* =========================================================
   CLEAR
========================================================= */

clear.addEventListener("click", () => {

    input.value = "";

    result.innerHTML = "";

    result.classList.add("hidden");

    input.focus();
});

/* =========================================================
   THEME
========================================================= */

theme.addEventListener("click", () => {

    document.body.classList.toggle("light");

    theme.textContent =
        document.body.classList.contains("light")
            ? "☀"
            : "☾";
});

/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

/* =========================================================
   MARKDOWN RENDERER
========================================================= */

function renderMarkdown(markdown) {

    if (!markdown) return "";

    let text = escapeHTML(String(markdown));

    /* Code blocks */

    const codeBlocks = [];

    text = text.replace(
        /```([\s\S]*?)```/g,
        function (_, code) {

            const id = `CODE_BLOCK_${codeBlocks.length}`;

            codeBlocks.push(
                `<pre><code>${code.trim()}</code></pre>`
            );

            return id;
        }
    );

    /* Headings */

    text = text.replace(
        /^### (.*)$/gm,
        "<h3>$1</h3>"
    );

    text = text.replace(
        /^## (.*)$/gm,
        "<h2>$1</h2>"
    );

    text = text.replace(
        /^# (.*)$/gm,
        "<h1>$1</h1>"
    );

    /* Bold */

    text = text.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );

    /* Italic */

    text = text.replace(
        /(?<!\*)\*([^*]+)\*(?!\*)/g,
        "<em>$1</em>"
    );

    /* Inline code */

    text = text.replace(
        /`([^`]+)`/g,
        "<code>$1</code>"
    );

    /* Horizontal rules */

    text = text.replace(
        /^---$/gm,
        "<hr>"
    );

    /* Bullet lists */

    text = text.replace(
        /(^|\n)[-*] (.*)/g,
        "$1<li>$2</li>"
    );

    /* Wrap consecutive list items */

    text = text.replace(
        /(<li>.*<\/li>\n?)+/g,
        function (match) {
            return `<ul>${match}</ul>`;
        }
    );

    /* Numbered lists */

    text = text.replace(
        /(^|\n)\d+\.\s+(.*)/g,
        "$1<oli>$2</oli>"
    );

    text = text.replace(
        /(<oli>.*<\/oli>\n?)+/g,
        function (match) {

            return `<ol>${match
                .replaceAll("<oli>", "<li>")
                .replaceAll("</oli>", "</li>")}</ol>`;
        }
    );

    /* Paragraphs */

    const blocks = text.split(/\n{2,}/);

    text = blocks
        .map((block) => {

            block = block.trim();

            if (!block) return "";

            if (
                block.startsWith("<h1") ||
                block.startsWith("<h2") ||
                block.startsWith("<h3") ||
                block.startsWith("<ul") ||
                block.startsWith("<ol") ||
                block.startsWith("<pre") ||
                block.startsWith("<hr")
            ) {
                return block;
            }

            return `<p>${block.replace(/\n/g, "<br>")}</p>`;
        })
        .join("");

    /* Restore code blocks */

    codeBlocks.forEach((block, index) => {

        text = text.replace(
            `CODE_BLOCK_${index}`,
            block
        );
    });

    return text;
}

/* =========================================================
   SPECIAL LEARNING PATH ENHANCEMENT
========================================================= */

function enhanceLearningPath(container) {

    if (currentTask !== "learn") return;

    const headings = container.querySelectorAll("h2");

    headings.forEach((heading) => {

        const text = heading.textContent.toLowerCase();

        if (
            text.includes("stage") ||
            text.includes("learner profile") ||
            text.includes("prerequisites") ||
            text.includes("revision")
        ) {

            heading.classList.add("learning-heading");
        }
    });
}

/* =========================================================
   DISPLAY AI ANSWER
========================================================= */

function displayAnswer(answer) {

    /* Handle quiz JSON */

    if (
        currentTask === "quiz" &&
        typeof answer === "object"
    ) {

        displayQuiz(answer);

        return;
    }

    result.innerHTML = `

        <div class="ai-result-header">

            <div class="ai-brand">

                <div class="ai-icon">✦</div>

                <div>
                    <strong>EduGenie AI</strong>
                    <small>Personalized learning response</small>
                </div>

            </div>

            <button class="copy-btn" id="copyAnswer">
                Copy
            </button>

        </div>

        <div class="answer" id="answerContent">

            ${renderMarkdown(answer)}

        </div>
    `;

    result.classList.remove("hidden");

    const answerContent =
        document.getElementById("answerContent");

    enhanceLearningPath(answerContent);

    const copyButton =
        document.getElementById("copyAnswer");

    copyButton.addEventListener("click", async () => {

        try {

            await navigator.clipboard.writeText(
                typeof answer === "string"
                    ? answer
                    : JSON.stringify(answer, null, 2)
            );

            copyButton.textContent = "Copied ✓";

            setTimeout(() => {
                copyButton.textContent = "Copy";
            }, 1500);

        } catch (error) {

            copyButton.textContent = "Copy failed";
        }
    });

    result.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/* =========================================================
   QUIZ DISPLAY
========================================================= */

function displayQuiz(quizData) {

    let questions = [];

    // Support:
    // { questions: [...] }
    // OR directly [...]
    if (Array.isArray(quizData)) {
        questions = quizData;
    } else if (Array.isArray(quizData.questions)) {
        questions = quizData.questions;
    } else {
        result.innerHTML = `
            <div class="answer">
                ${renderMarkdown(JSON.stringify(quizData, null, 2))}
            </div>
        `;

        result.classList.remove("hidden");
        return;
    }

    let html = `
        <div class="ai-result-header">
            <div class="ai-brand">
                <div class="ai-icon">✦</div>
                <div>
                    <strong>EduGenie Quiz</strong>
                    <small>Test your knowledge</small>
                </div>
            </div>
        </div>

        <div class="quiz-container">
    `;

    questions.forEach((question, index) => {

        const questionText =
            question.question ||
            question.text ||
            `Question ${index + 1}`;

        const options =
            question.options ||
            question.choices ||
            [];

        // Get the answer from Gemini
        let correct =
            question.answer ??
            question.correct_answer ??
            question.correctAnswer ??
            question.correct;

        /*
         * GEMINI MAY RETURN:
         *
         * 0  → first option
         * 1  → second option
         * 2  → third option
         * 3  → fourth option
         *
         * OR:
         *
         * 1  → first option
         * 2  → second option
         * 3  → third option
         * 4  → fourth option
         */

        if (
            typeof correct === "number" ||
            (
                typeof correct === "string" &&
                /^\d+$/.test(correct.trim())
            )
        ) {

            const answerNumber = Number(correct);

            /*
             * Your current Gemini output is clearly
             * using 0-based indexing.
             *
             * Therefore:
             * 0 = first option
             * 1 = second option
             * 2 = third option
             * 3 = fourth option
             */

            if (options[answerNumber] !== undefined) {
                correct = options[answerNumber];
            }

            /*
             * Fallback for 1-based answers such as 1,2,3,4
             */
            else if (options[answerNumber - 1] !== undefined) {
                correct = options[answerNumber - 1];
            }
        }

        html += `
            <div class="quiz">

                <div class="quiz-number">
                    QUESTION ${index + 1}
                </div>

                <h3>
                    ${escapeHTML(String(questionText))}
                </h3>

                <div class="options">
        `;

        options.forEach((option) => {

            html += `
                <button
                    class="option"
                    data-answer="${escapeHTML(String(option))}"
                    data-correct="${escapeHTML(String(correct ?? ""))}"
                >
                    ${escapeHTML(String(option))}
                </button>
            `;

        });

        html += `
                </div>

                <div class="feedback"></div>

            </div>
        `;
    });

    html += `
        </div>
    `;

    result.innerHTML = html;
    result.classList.remove("hidden");

    /*
     * ANSWER CHECKING
     */

    document.querySelectorAll(".option").forEach((button) => {

        button.addEventListener("click", () => {

            const quiz = button.closest(".quiz");

            const feedback =
                quiz.querySelector(".feedback");

            const selected =
                button.dataset.answer.trim();

            const correct =
                button.dataset.correct.trim();

            /*
             * Prevent clicking multiple answers
             */

            quiz
                .querySelectorAll(".option")
                .forEach((option) => {
                    option.disabled = true;
                });

            /*
             * CHECK ANSWER
             */

            if (
                selected.toLowerCase() ===
                correct.toLowerCase()
            ) {

                button.classList.add("correct");

                feedback.textContent =
                    "✓ Correct! Great job.";

            } else {

                button.classList.add("wrong");

                /*
                 * Highlight the actual correct answer
                 */

                quiz
                    .querySelectorAll(".option")
                    .forEach((option) => {

                        if (
                            option.dataset.answer
                                .trim()
                                .toLowerCase() ===
                            correct.toLowerCase()
                        ) {
                            option.classList.add("correct");
                        }

                    });

                feedback.textContent =
                    `✗ Not quite. Correct answer: ${correct}`;
            }

        });

    });

    result.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/* =========================================================
   BACKEND ENDPOINT MAPPING
========================================================= */

const endpoints = {

    qa: "/qa",

    explain: "/explain",

    quiz: "/quiz",

    summarize: "/summarize",

    learn: "/learn/recommendations"
};

/* =========================================================
   GEMINI / FASTAPI REQUEST
========================================================= */

run.addEventListener("click", async () => {

    const question = input.value.trim();

    if (!question) {

        input.focus();

        return;
    }

    run.disabled = true;

    loading.classList.remove("hidden");

    result.classList.add("hidden");

    result.innerHTML = "";

    try {

        const endpoint = endpoints[currentTask];

        const response = await fetch(endpoint, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                text: question,

                level: level.value
            })
        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                `Server returned ${response.status}`
            );
        }

        const answer =
            data.result ||
            data.answer ||
            data.response ||
            data.text ||
            data.content;

        if (
            answer === undefined ||
            answer === null
        ) {

            throw new Error(
                "No answer was returned by the server."
            );
        }

        displayAnswer(answer);

    } catch (error) {

        result.innerHTML = `

            <div class="error">

                <strong>Something went wrong.</strong>

                <br><br>

                ${escapeHTML(error.message)}

                <br><br>

                Please check that your FastAPI server
                and Gemini API configuration are running.

            </div>
        `;

        result.classList.remove("hidden");

    } finally {

        loading.classList.add("hidden");

        run.disabled = false;
    }
});

/* =========================================================
   CTRL + ENTER
========================================================= */

input.addEventListener("keydown", (event) => {

    if (
        event.key === "Enter" &&
        (event.ctrlKey || event.metaKey)
    ) {

        run.click();
    }
});

/* =========================================================
   CURSOR FOLLOWING GLOW
========================================================= */

document.addEventListener("mousemove", (event) => {

    document.documentElement.style.setProperty(
        "--mouse-x",
        `${event.clientX}px`
    );

    document.documentElement.style.setProperty(
        "--mouse-y",
        `${event.clientY}px`
    );
});

/* =========================================================
   INITIALIZATION
========================================================= */

input.placeholder = tools.qa.placeholder;