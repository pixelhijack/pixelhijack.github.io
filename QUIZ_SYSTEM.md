# Client-Side Quiz System Documentation

## Rebuild - Step by Step

### Design Principles

- **Functional programming only** - No classes, constructors, or OOP
- **Simple IDs** - Questions: A, B, C... Cards: 1, 2, 3...
- **Simplified exit syntax** - `exit: "/url"` instead of `exit: true, exitUrl: "/url"`
- **Incremental features** - Building step by step

### Current Status: Step 1 - Basic Rendering & Navigation

**What works:**

- ✅ Renders questions with cards
- ✅ Grid layout based on card count
- ✅ Click on card → visual selection
- ✅ Navigate to sub-questions (tree depth-first)
- ✅ Exit cards redirect to URLs
- ✅ Simple functional implementation

**Not yet implemented:**

- ❌ Multi-choice questions
- ❌ localStorage persistence
- ❌ Choice tracking
- ❌ Query parameter passing
- ❌ Sibling question navigation
- ❌ Resume capability

### Quiz JSON Structure (Step 1)

```json
{
  "type": "quiz",
  "id": "quiz-id",
  "defaultExit": "/fallback-page",
  "questions": [
    {
      "id": "A",
      "title": "Question text?",
      "cards": [
        {
          "id": "1",
          "icon": "🔬",
          "title": "Option 1",
          "body": "Description",
          "questions": [
            {
              "id": "B",
              "title": "Sub-question?",
              "cards": [
                { "id": "1", "title": "Sub-option 1", "exit": "/page1" },
                { "id": "2", "title": "Sub-option 2", "exit": "/page2" }
              ]
            }
          ]
        },
        {
          "id": "2",
          "title": "Option 2",
          "exit": "/direct-exit"
        }
      ]
    }
  ]
}
```

### Property Reference

#### Card Properties (Simplified)

| Property    | Type   | Required | Description                               |
| ----------- | ------ | -------- | ----------------------------------------- |
| `id`        | string | ✅       | Simple ID: "1", "2", "3"                  |
| `icon`      | string | ❌       | Emoji or icon                             |
| `title`     | string | ❌       | Card title                                |
| `body`      | string | ❌       | Card description                          |
| `exit`      | string | ❌       | URL to redirect to (presence = exit card) |
| `questions` | array  | ❌       | Sub-questions (creates tree)              |

Note: No more `exit: boolean` + `exitUrl` combo. Just `exit: "/url"` or omit for non-exit cards.

### Current Implementation

```javascript
window.QuizEngine = (() => {
  const getGridClass = (cardCount) => {
    /* ... */
  };
  const renderCard = (card) => {
    /* ... */
  };
  const renderQuestion = (question) => {
    /* ... */
  };

  const create = (config) => {
    let container = null;
    let currentQuestion = null;

    const handleCardClick = (cardId) => {
      // 1. Visual selection
      // 2. Find card data
      // 3. Navigate: exit, sub-question, or complete
    };

    const render = () => {
      container.innerHTML = renderQuestion(currentQuestion);
      attachListeners();
    };

    const init = (containerId) => {
      currentQuestion = config.questions[0];
      render();
    };

    return { init };
  };

  return { create };
})();
```

### Usage

```javascript
// In renderTreeServer.js, injected into page:
const quiz = QuizEngine.create({
  id: "my-quiz",
  questions: [...]
});
quiz.init('content-container');
```

---

## First iteration (archived)

### Original prompt

i figured card based quiz would be just a perfect candidate for a rather client side experience, instead of putting 2-4 cards to different subpages and always go the full round trip. i thought having a new manifest.json type called "quiz", with the following structure:

- type: quiz
- it would have arbitrary number of questions, each question might have a title (or no title at all), 1-4 (or arbitrary number of) cards
- each card can have an icon, a title, a body as now
- questions by default single choice, i.e. clicking on one card will let you to the next question, but there might be multi-choice questions where a user can select 2 or more cards, like checkboxes vs radiobuttons. if so, there might a button with NEXT needed to explicitly proceed to the next question, i'm not sure about this. maybe a next button would be needed always even for single choice cards as well for the sake of consistency?
- each question's answer card might have sub-choices, making it a tree structure, so for questionA -> A1 - A2 -> if selecting A2 -> Question B -> B1 - B2 -B3 so any question answer (card) could lead to its sub-questions. if there are no more sub-questions, the quiz should proceed with the next top-level question until all the top-levels end (like breath-or depth-first algorithm?)
- i need the ability that some cards could be exits, leaving to a form or linking to another page
- i need the ability to save and pass the whole choice tree how a user proceeded through the questions and cards and pass this to the form or page it exits. for this i was thinking to have the cards ids like A1, A2, B1, B2, B3 etc and pass this as a query param to the exit page link (this could be also saved into localstorage if user would leave the quiz and gets back / reloads the page, maybe checking the quiz is the same (saving the quiz too to localstorage, json stringify checking equality), but this can be a next step)

## Overview

The quiz system allows you to create interactive, card-based quizzes that run entirely on the client side with localStorage persistence. Users can navigate through questions using a tree structure, make single or multiple selections, and be redirected to specific pages based on their choices.

## Features

- ✅ **Client-side rendering** - No page reloads between questions
- ✅ **Single & multi-choice questions** - Flexible card selection modes
- ✅ **Tree navigation** - Questions can have sub-questions (depth-first traversal)
- ✅ **Exit cards** - Any card can redirect to a specific URL
- ✅ **Choice tracking** - All user selections are tracked with card IDs
- ✅ **localStorage persistence** - Users can resume incomplete quizzes
- ✅ **Query parameter passing** - Choices are passed as URL params to exit pages

## Quiz Structure

### Basic Quiz Configuration

```json
{
  "type": "quiz",
  "id": "unique-quiz-id",
  "defaultExit": "/fallback-page",
  "questions": [
    {
      "id": "Q1",
      "title": "Question title (optional)",
      "multiChoice": false,
      "cards": [
        {
          "id": "Q1_A",
          "icon": "🚀",
          "title": "Card title",
          "body": "Card description",
          "exit": false,
          "exitUrl": "/some-page",
          "questions": []
        }
      ]
    }
  ]
}
```

### Property Reference

#### Quiz Root Properties

| Property      | Type   | Required | Description                                            |
| ------------- | ------ | -------- | ------------------------------------------------------ |
| `type`        | string | ✅       | Must be `"quiz"`                                       |
| `id`          | string | ✅       | Unique identifier for the quiz (used for localStorage) |
| `defaultExit` | string | ❌       | Default URL when quiz completes without explicit exit  |
| `questions`   | array  | ✅       | Array of question objects                              |

#### Question Properties

| Property      | Type    | Required | Description                                                   |
| ------------- | ------- | -------- | ------------------------------------------------------------- |
| `id`          | string  | ✅       | Unique identifier for the question                            |
| `title`       | string  | ❌       | Question text (h2 heading)                                    |
| `multiChoice` | boolean | ❌       | If `true`, users can select multiple cards (default: `false`) |
| `cards`       | array   | ✅       | Array of card objects (1-N cards)                             |

#### Card Properties

| Property    | Type    | Required | Description                                                           |
| ----------- | ------- | -------- | --------------------------------------------------------------------- |
| `id`        | string  | ✅       | Unique identifier for the card (e.g., `"Q1_A"`)                       |
| `icon`      | string  | ❌       | Emoji or icon to display                                              |
| `title`     | string  | ❌       | Card title (h3)                                                       |
| `body`      | string  | ❌       | Card description text                                                 |
| `exit`      | boolean | ❌       | If `true`, this card exits the quiz                                   |
| `exitUrl`   | string  | ❌       | URL to redirect to when this card is selected (requires `exit: true`) |
| `questions` | array   | ❌       | Sub-questions (creates tree structure)                                |

## Navigation Flow

### Single Choice (Default)

```
User clicks card → Card is selected →
  ↓
Is it an exit card?
  ├─ Yes → Navigate to exitUrl with choices
  └─ No → Does it have sub-questions?
         ├─ Yes → Show first sub-question
         └─ No → Show next sibling question
```

### Multi-Choice

```
User clicks card → Toggle selection →
  ↓
User clicks "Tovább →" button →
  ↓
Process all selected cards → Navigate to next question
```

## Tree Navigation

The quiz uses **depth-first traversal**:

1. If a selected card has `questions`, navigate to its first sub-question
2. When sub-questions are exhausted, return to parent level
3. Continue with next sibling question at parent level
4. Quiz completes when all top-level questions are exhausted

### Example Tree

```
Q1: "What interests you?"
├─ Card A: "Research"
│  └─ Q1.1: "Experience level?"
│     ├─ Card A1: "Beginner" [EXIT → /beginner]
│     └─ Card A2: "Advanced" [EXIT → /advanced]
├─ Card B: "Teaching"
│  └─ Q1.2: "Your role?"
│     ├─ Card B1: "Student" [EXIT → /student]
│     └─ Card B2: "Teacher" [EXIT → /teacher]
└─ Card C: "Personal" [EXIT → /personal]

Flow example: Q1 → Select A → Q1.1 → Select A1 → EXIT
```

## localStorage Persistence

### Saved Data Structure

```javascript
{
  "quizId": "aipresszo-main-quiz",
  "currentPath": [[0, "Q1_A"], [0, "Q1_1_A"]],
  "choices": [
    {
      "questionId": "Q1",
      "cardId": "Q1_A",
      "cardLabel": "Research"
    },
    {
      "questionId": "Q1_1",
      "cardId": "Q1_1_A",
      "cardLabel": "Beginner"
    }
  ]
}
```

### Resume Behavior

- On page load, checks for saved state in localStorage
- If found and quiz ID matches, prompts user to resume
- If user declines, starts fresh
- State is cleared when quiz completes or exits

## Choice Tracking & Export

### Tracked Information

Each choice records:

- `questionId` - Which question was answered
- `cardId` - Which card was selected
- `cardLabel` - Display text of the card

### Query Parameter Format

Choices are passed as comma-separated card IDs:

```
/exit-page?choices=Q1_A,Q1_1_A,Q2_B
```

You can then parse this on the destination page to understand the user's journey.

## Example Implementations

### Simple Linear Quiz

```json
{
  "type": "quiz",
  "id": "simple-quiz",
  "defaultExit": "/results",
  "questions": [
    {
      "id": "Q1",
      "title": "What's your experience level?",
      "cards": [
        { "id": "Q1_beginner", "icon": "🌱", "title": "Beginner" },
        { "id": "Q1_intermediate", "icon": "🌿", "title": "Intermediate" },
        { "id": "Q1_advanced", "icon": "🌳", "title": "Advanced" }
      ]
    },
    {
      "id": "Q2",
      "title": "What's your goal?",
      "cards": [
        { "id": "Q2_learn", "icon": "📚", "title": "Learning" },
        { "id": "Q2_build", "icon": "🔨", "title": "Building" }
      ]
    }
  ]
}
```

### Multi-Choice Question

```json
{
  "id": "Q3",
  "title": "Select all that interest you:",
  "multiChoice": true,
  "cards": [
    { "id": "Q3_AI", "icon": "🤖", "title": "AI" },
    { "id": "Q3_ML", "icon": "🧠", "title": "Machine Learning" },
    { "id": "Q3_Data", "icon": "📊", "title": "Data Science" }
  ]
}
```

### Tree with Exits

```json
{
  "id": "Q1",
  "title": "Choose your path:",
  "cards": [
    {
      "id": "Q1_research",
      "icon": "🔬",
      "title": "Research",
      "questions": [
        {
          "id": "Q1_1",
          "title": "Field of study?",
          "cards": [
            {
              "id": "Q1_1_bio",
              "title": "Biology",
              "exit": true,
              "exitUrl": "/bio-research"
            },
            {
              "id": "Q1_1_cs",
              "title": "Computer Science",
              "exit": true,
              "exitUrl": "/cs-research"
            }
          ]
        }
      ]
    },
    {
      "id": "Q1_industry",
      "icon": "💼",
      "title": "Industry",
      "exit": true,
      "exitUrl": "/industry-path"
    }
  ]
}
```

## CSS Classes

The quiz system uses these CSS classes (already defined in your styles):

- `.quiz-cards` - Container for cards
- `.quiz-cards-2-1` - 2 columns, 1-2 cards
- `.quiz-cards-2-2` - 2 columns, 3-4 cards
- `.quiz-cards-2-3` - 2 columns, 5-6 cards
- `.quiz-card` - Individual card
- `.quiz-card.selected` - Selected card state
- `.quiz-card-icon` - Icon container

## Integration with Forms

To capture choices on a form page:

```javascript
// On your exit/form page
const urlParams = new URLSearchParams(window.location.search);
const choices = urlParams.get("choices"); // "Q1_A,Q1_1_B,Q2_C"

// Include in form submission
const choiceArray = choices ? choices.split(",") : [];
// Add to your form payload
payload.quizChoices = choiceArray;
```

## Migration from Old Quiz Format

**Old format** (multi-page):

```json
{
  "slug": "quiz/example",
  "tree": {
    "type": "div",
    "children": [
      { "type": "div", "class": "quiz-card", "onclick": "selectCard(...)" }
    ]
  }
}
```

**New format** (client-side):

```json
{
  "slug": "quiz-example",
  "tree": {
    "type": "quiz",
    "id": "example-quiz",
    "questions": [...]
  }
}
```

## Best Practices

1. **Card IDs**: Use hierarchical naming like `Q1_A`, `Q1_1_B` for clarity
2. **Question IDs**: Use descriptive IDs like `Q_experience_level`
3. **Tree depth**: Keep tree depth reasonable (2-3 levels max)
4. **Card count**: 2-6 cards per question for best UX
5. **Multi-choice**: Use sparingly, only when actually needed
6. **Exit strategy**: Either use exit cards OR defaultExit, not both randomly
7. **Labels**: Keep card titles short, use body for details

## Testing Your Quiz

1. Visit `/quiz-new` (or your quiz slug)
2. Make selections and verify navigation
3. Refresh page mid-quiz to test localStorage
4. Complete quiz and check exit URL parameters
5. Clear localStorage and restart to test fresh experience

```javascript
// Clear quiz state from browser console
localStorage.removeItem("quiz_state");
```

## Future Enhancements

Potential additions:

- ❌ Progress indicator (X of Y questions)
- ❌ Back button functionality
- ❌ Quiz results/summary page
- ❌ Analytics tracking integration
- ❌ Conditional branching (skip questions based on previous answers)
- ❌ Time limits per question
- ❌ Score calculation

## First iteration

```javascript
/**
 * Client-side Quiz Engine
 * Handles interactive card-based quizzes with tree navigation
 * Functional implementation using closures instead of classes
 */
window.QuizEngine = (() => {
  const STORAGE_KEY = "quiz_state";

  // Pure functions for state management
  const loadState = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("Failed to load quiz state:", e);
      return null;
    }
  };

  const saveState = (quizId, currentPath, choices) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          quizId,
          currentPath,
          choices,
        })
      );
    } catch (e) {
      console.error("Failed to save quiz state:", e);
    }
  };

  const clearState = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  // Pure function to get current question from path
  const getCurrentQuestion = (questions, currentPath) => {
    let questionList = questions;
    let question = null;

    for (let i = 0; i < currentPath.length; i++) {
      const [qIndex, cardId] = currentPath[i];
      question = questionList[qIndex];

      const card = question?.cards.find((c) => c.id === cardId);
      if (card?.questions) {
        questionList = card.questions;
      } else {
        if (i === currentPath.length - 1) {
          if (qIndex + 1 < questionList.length) {
            question = questionList[qIndex + 1];
          } else {
            question = null;
          }
        }
      }
    }

    if (currentPath.length === 0 && questionList.length > 0) {
      question = questionList[0];
    }

    return question;
  };

  // Pure function to get current question list from path
  const getCurrentQuestionList = (questions, currentPath) => {
    let questionList = questions;

    for (let i = 0; i < currentPath.length - 1; i++) {
      const [qIndex, cardId] = currentPath[i];
      const question = questionList[qIndex];
      const card = question?.cards.find((c) => c.id === cardId);
      if (card?.questions) {
        questionList = card.questions;
      }
    }

    return questionList;
  };

  // Pure rendering functions
  const getGridClass = (cardCount) => {
    if (cardCount <= 2) return "quiz-cards-2-1";
    if (cardCount === 3) return "quiz-cards-2-2";
    if (cardCount === 4) return "quiz-cards-2-2";
    if (cardCount <= 6) return "quiz-cards-2-3";
    return "quiz-cards-2-3";
  };

  const renderCard = (card) => {
    const icon = card.icon
      ? `<div class="quiz-card-icon">${card.icon}</div>`
      : "";
    const title = card.title ? `<h3>${card.title}</h3>` : "";
    const body = card.body ? `<p>${card.body}</p>` : "";
    const exitIndicator = card.exit ? ' data-exit="true"' : "";

    return `
      <div class="quiz-card" data-card-id="${card.id}"${exitIndicator}>
        ${icon}
        ${title}
        ${body}
      </div>
    `;
  };

  const renderQuestion = (question) => {
    const title = question.title
      ? `<h2 class="text-black mb-8 text-2xl mx-auto mt-16 ml-8 text-left">${question.title}</h2>`
      : "";
    const gridClass = getGridClass(question.cards.length);
    const cardsHtml = question.cards.map(renderCard).join("");
    const showNextBtn = question.multiChoice || false;
    const nextBtnHtml = showNextBtn
      ? `<button id="quiz-next-btn" class="mx-auto mt-8 px-8 py-3 bg-black text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed" disabled>
          Tovább →
        </button>`
      : "";

    return `
      <div class="min-h-screen flex flex-col justify-center text-black">
        ${title}
        <div class="quiz-cards ${gridClass}" data-multi-choice="${
      question.multiChoice || false
    }">
          ${cardsHtml}
        </div>
        ${nextBtnHtml}
      </div>
    `;
  };

  const renderCompletion = () => `
    <div class="min-h-screen flex flex-col items-center justify-center text-black">
      <h2 class="text-3xl mb-4">Quiz complete!</h2>
      <p>Thank you for your responses.</p>
    </div>
  `;

  // Pure function to build exit URL
  const buildExitUrl = (url, choices) => {
    const choiceIds = choices.map((c) => c.cardId).join(",");
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}choices=${encodeURIComponent(choiceIds)}`;
  };

  // Pure function to advance path to next question
  const advanceToNextQuestion = (questions, currentPath, currentQuestion) => {
    const questionList = getCurrentQuestionList(questions, currentPath);
    const currentIndex = questionList.findIndex(
      (q) => q.id === currentQuestion.id
    );

    if (currentIndex + 1 < questionList.length) {
      if (currentPath.length > 0) {
        const newPath = [...currentPath];
        newPath[newPath.length - 1] = [
          newPath[newPath.length - 1][0] + 1,
          newPath[newPath.length - 1][1],
        ];
        return newPath;
      } else {
        return [[currentIndex + 1, null]];
      }
    } else {
      const newPath = [...currentPath];
      newPath.pop();
      if (newPath.length > 0) {
        return advanceToNextQuestion(questions, newPath, currentQuestion);
      }
      return newPath;
    }
  };

  // Main quiz factory function
  const create = (config) => {
    // State (enclosed in closure)
    let state = {
      config,
      questions: config.questions || [],
      currentPath: [],
      choices: [],
      container: null,
      currentQuestion: null,
      selectedCards: new Set(),
    };

    // Event handlers
    const handleCardClick = (cardId, isExit, isMultiChoice) => {
      if (isMultiChoice) {
        // Toggle selection
        const newSelected = new Set(state.selectedCards);
        if (newSelected.has(cardId)) {
          newSelected.delete(cardId);
        } else {
          newSelected.add(cardId);
        }
        state.selectedCards = newSelected;

        // Update UI
        const cardElem = state.container.querySelector(
          `[data-card-id="${cardId}"]`
        );
        cardElem?.classList.toggle("selected", newSelected.has(cardId));

        const nextBtn = document.getElementById("quiz-next-btn");
        if (nextBtn) {
          nextBtn.disabled = newSelected.size === 0;
        }
      } else {
        // Single choice - immediate progression
        state.selectedCards = new Set([cardId]);

        // Visual feedback
        state.container
          .querySelectorAll(".quiz-card")
          .forEach((c) => c.classList.remove("selected"));
        const cardElem = state.container.querySelector(
          `[data-card-id="${cardId}"]`
        );
        cardElem?.classList.add("selected");

        setTimeout(() => {
          if (isExit) {
            handleExit(cardId);
          } else {
            handleSelection();
          }
        }, 300);
      }
    };

    const handleSelection = () => {
      // Record choices (pure operation)
      const newChoices = Array.from(state.selectedCards).map((cardId) => {
        const card = state.currentQuestion.cards.find((c) => c.id === cardId);
        return {
          questionId: state.currentQuestion.id,
          cardId,
          cardLabel: card?.title || card?.body || cardId,
        };
      });

      state.choices = [...state.choices, ...newChoices];

      // Update path
      const firstSelectedCard = state.currentQuestion.cards.find((c) =>
        state.selectedCards.has(c.id)
      );

      if (firstSelectedCard?.questions?.length > 0) {
        const questionList = getCurrentQuestionList(
          state.questions,
          state.currentPath
        );
        const currentIndex = questionList.findIndex(
          (q) => q.id === state.currentQuestion.id
        );
        state.currentPath = [
          ...state.currentPath,
          [currentIndex, firstSelectedCard.id],
        ];
      } else {
        state.currentPath = advanceToNextQuestion(
          state.questions,
          state.currentPath,
          state.currentQuestion
        );
      }

      saveState(state.config.id, state.currentPath, state.choices);
      render();
    };

    const handleExit = (cardId) => {
      const card = state.currentQuestion.cards.find((c) => c.id === cardId);

      // Record final choice
      state.choices = [
        ...state.choices,
        {
          questionId: state.currentQuestion.id,
          cardId,
          cardLabel: card?.title || card?.body || cardId,
        },
      ];

      if (card?.exitUrl) {
        navigateToExit(card.exitUrl);
      } else {
        handleCompletion();
      }
    };

    const handleCompletion = () => {
      if (state.config.defaultExit) {
        navigateToExit(state.config.defaultExit);
      } else {
        state.container.innerHTML = renderCompletion();
        clearState();
      }
    };

    const navigateToExit = (url) => {
      const exitUrl = buildExitUrl(url, state.choices);
      clearState();
      window.location.href = exitUrl;
    };

    const attachCardListeners = () => {
      const container = state.container.querySelector(".quiz-cards");
      const isMultiChoice = container.dataset.multiChoice === "true";
      const nextBtn = document.getElementById("quiz-next-btn");

      container.querySelectorAll(".quiz-card").forEach((card) => {
        const cardId = card.dataset.cardId;
        const isExit = card.dataset.exit === "true";
        card.addEventListener("click", () =>
          handleCardClick(cardId, isExit, isMultiChoice)
        );
      });

      nextBtn?.addEventListener("click", handleSelection);
    };

    const render = () => {
      state.currentQuestion = getCurrentQuestion(
        state.questions,
        state.currentPath
      );

      if (!state.currentQuestion) {
        handleCompletion();
        return;
      }

      state.selectedCards = new Set();
      state.container.innerHTML = renderQuestion(state.currentQuestion);
      attachCardListeners();
    };

    const init = (containerId) => {
      state.container = document.getElementById(containerId);

      if (!state.container) {
        console.error("Quiz container not found:", containerId);
        return;
      }

      // Try to restore from localStorage
      const saved = loadState();
      if (saved && saved.quizId === state.config.id) {
        if (confirm("Resume your previous quiz?")) {
          state.currentPath = saved.currentPath || [];
          state.choices = saved.choices || [];
        }
      }

      render();
    };

    // Public API
    return { init };
  };

  // Exposed API
  return { create };
})();
```
