// Client-side JavaScript for the application
// This file is loaded as a static asset by the browser

// Email variable - will be set from data attribute
const email = document.getElementById('content-container')?.getAttribute('data-user-email');

/**
 * Submit a form with intent tracking
 */
function submitForm(formElem, intent) {
  try {
    const payload = { intent, checkboxes: [] };
    const fd = new FormData(formElem);
    
    // Collect form entries (skip checkboxes - they're handled separately below)
    for (const [key, value] of fd.entries()) {
      // Skip checkbox fields - they'll be processed in step 2
      const inputElem = formElem.querySelector('[name="' + key + '"]');
      if (inputElem && inputElem.type === 'checkbox') {
        continue; // Skip checkboxes
      }
      
      // For other fields (text, email, textarea, etc.)
      if (payload[key] === undefined) payload[key] = value;
      // The array logic is still useful for multi-selects or other same-named fields
      else if (Array.isArray(payload[key])) payload[key].push(value); 
      else payload[key] = [payload[key], value];
    }
    
    // 2. Manually process checkboxes to capture checked state AND label text
    formElem.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      // Use the UNIQUE NAME as the key in the payload
      if (cb.name) {
        // Find the associated label
        let label = cb.value; // fallback
        if (cb.dataset && cb.dataset.label) {
          label = cb.dataset.label;
        } else if (cb.id) {
          const labelElem = formElem.querySelector('label[for="' + cb.id + '"]');
          if (labelElem && labelElem.textContent) {
            label = labelElem.textContent.trim();
          }
        }
        
        if (cb.checked) {
          payload['checkboxes'].push({
            checked: cb.checked,
            label: label
          });
        }
      }
    });

    fetch('/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (res.ok) {
          formElem.reset();
        } else {
          console.warn('Sorry, something went wrong at /', intent);
        }
      })
      .catch(() => console.error('Network error — please try again.'));
  } catch (err) {
    console.error('submitForm error', err);
  }
}

/**
 * Send a magic link for passwordless authentication
 */
function sendMagicLink(formElem, redirectTo) {
  const emailInput = formElem.querySelector('input[type="email"]');
  const submitBtn = formElem.querySelector('button[type="submit"]');
  const messageDiv = formElem.querySelector('.message') || formElem.parentElement.querySelector('.message');
  
  if (!emailInput || !emailInput.value) {
    console.error('Email input not found or empty');
    return;
  }

  const email = emailInput.value;
  const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Magic Link';
  
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
  }
  
  if (messageDiv) {
    messageDiv.className = 'message';
    messageDiv.textContent = '';
  }

  fetch('/auth/send-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, redirectTo })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        if (messageDiv) {
          messageDiv.className = 'message success';
          messageDiv.textContent = data.message;
        }
        formElem.reset();
      } else if (data.error) {
        throw new Error(data.error);
      }
    })
    .catch(error => {
      if (messageDiv) {
        messageDiv.className = 'message error';
        messageDiv.textContent = error.message;
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
}

/**
 * Submit quiz form with answers
 */
function submitQuiz(formElem, projectName, quizId, redirectTo) {
  const emailInput = formElem.querySelector('input[type="email"]');
  const submitBtn = formElem.querySelector('button[type="submit"]');
  const messageDiv = formElem.querySelector('.message') || formElem.parentElement.querySelector('.message');
  
  if (!emailInput || !emailInput.value) {
    alert('Please enter your email address');
    return false;
  }

  const email = emailInput.value;
  const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';
  
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Loading...';
  }

  // Collect all form data
  const fd = new FormData(formElem);
  const quizData = {
    quizId: quizId,
    checkboxes: []
  };

  // Capture URL parameters (e.g., interest from ?interest=onboarding/pilot)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('interest')) {
    quizData.interest = urlParams.get('interest');
  }

  // Collect non-checkbox fields
  for (const [key, value] of fd.entries()) {
    const inputElem = formElem.querySelector('[name="' + key + '"]');
    if (inputElem && inputElem.type !== 'checkbox' && key !== 'email') {
      quizData[key] = value;
    }
  }

  // Collect checkboxes with labels
  formElem.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    if (cb.name && cb.checked) {
      let label = cb.value;
      if (cb.dataset && cb.dataset.label) {
        label = cb.dataset.label;
      } else if (cb.id) {
        const labelElem = formElem.querySelector('label[for="' + cb.id + '"]');
        if (labelElem && labelElem.textContent) {
          label = labelElem.textContent.trim();
        }
      }
      quizData.checkboxes.push({
        name: cb.name,
        label: label
      });
    }
  });

  // Submit to server
  fetch('/quiz/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      projectName: projectName,
      quizData: quizData,
      redirectTo: redirectTo || '/'
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        if (messageDiv) {
          messageDiv.className = 'message success';
          messageDiv.textContent = data.message;
        }
        
        // If user is already authenticated, redirect immediately
        if (data.sentMagicLink === false && data.redirectTo) {
          setTimeout(() => {
            window.location.href = data.redirectTo;
          }, 1000);
        } else {
          // User needs to check email for magic link
          formElem.reset();
        }
      } else if (data.error) {
        throw new Error(data.error);
      }
    })
    .catch(error => {
      if (messageDiv) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Error: ' + error.message;
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });

  return false; // Prevent default form submission
}

/**
 * Client-side Quiz Engine
 * Handles interactive card-based quizzes with tree navigation
 */
window.QuizEngine = (function() {
  const STORAGE_KEY = 'quiz_state';
  
  class Quiz {
    constructor(config) {
      this.config = config;
      this.questions = config.questions || [];
      this.currentPath = []; // Stack of [questionIndex, cardId]
      this.choices = []; // All choices made: [{questionId, cardId, cardLabel}]
      this.container = null;
      this.currentQuestion = null;
      this.selectedCards = new Set();
    }

    init(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error('Quiz container not found:', containerId);
        return;
      }

      // Try to restore from localStorage
      const saved = this.loadState();
      if (saved && this.isSameQuiz(saved.quizId)) {
        if (confirm('Resume your previous quiz?')) {
          this.currentPath = saved.currentPath || [];
          this.choices = saved.choices || [];
        }
      }

      this.render();
    }

    isSameQuiz(savedQuizId) {
      return savedQuizId === this.config.id;
    }

    loadState() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        console.error('Failed to load quiz state:', e);
        return null;
      }
    }

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          quizId: this.config.id,
          currentPath: this.currentPath,
          choices: this.choices
        }));
      } catch (e) {
        console.error('Failed to save quiz state:', e);
      }
    }

    clearState() {
      localStorage.removeItem(STORAGE_KEY);
    }

    getCurrentQuestion() {
      // Navigate through the question tree based on currentPath
      let questions = this.questions;
      let question = null;

      for (let i = 0; i < this.currentPath.length; i++) {
        const [qIndex, cardId] = this.currentPath[i];
        question = questions[qIndex];
        
        // Find the card and check for sub-questions
        const card = question.cards.find(c => c.id === cardId);
        if (card && card.questions) {
          questions = card.questions;
        } else {
          // No more sub-questions, continue with sibling questions
          if (i === this.currentPath.length - 1) {
            // Last item in path, get next sibling
            if (qIndex + 1 < questions.length) {
              question = questions[qIndex + 1];
            } else {
              question = null; // No more questions
            }
          }
        }
      }

      // If currentPath is empty, return first question
      if (this.currentPath.length === 0 && questions.length > 0) {
        question = questions[0];
      }

      return question;
    }

    render() {
      this.currentQuestion = this.getCurrentQuestion();
      
      if (!this.currentQuestion) {
        // Quiz complete - check for exit
        this.handleCompletion();
        return;
      }

      this.selectedCards.clear();
      
      const html = this.renderQuestion(this.currentQuestion);
      this.container.innerHTML = html;

      // Attach event listeners
      this.attachCardListeners();
    }

    renderQuestion(question) {
      const title = question.title ? `<h2 class="text-black mb-8 text-2xl mx-auto mt-16 ml-8 text-left">${question.title}</h2>` : '';
      const gridClass = this.getGridClass(question.cards.length);
      
      const cardsHtml = question.cards.map(card => this.renderCard(card)).join('');
      
      const showNextBtn = question.multiChoice || false;
      const nextBtnHtml = showNextBtn ? 
        `<button id="quiz-next-btn" class="mx-auto mt-8 px-8 py-3 bg-black text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed" disabled>
          Tovább →
        </button>` : '';

      return `
        <div class="min-h-screen flex flex-col justify-center text-black">
          ${title}
          <div class="quiz-cards ${gridClass}" data-multi-choice="${question.multiChoice || false}">
            ${cardsHtml}
          </div>
          ${nextBtnHtml}
        </div>
      `;
    }

    renderCard(card) {
      const icon = card.icon ? `<div class="quiz-card-icon">${card.icon}</div>` : '';
      const title = card.title ? `<h3>${card.title}</h3>` : '';
      const body = card.body ? `<p>${card.body}</p>` : '';
      const exitIndicator = card.exit ? ' data-exit="true"' : '';

      return `
        <div class="quiz-card" data-card-id="${card.id}"${exitIndicator}>
          ${icon}
          ${title}
          ${body}
        </div>
      `;
    }

    getGridClass(cardCount) {
      if (cardCount <= 2) return 'quiz-cards-2-1';
      if (cardCount === 3) return 'quiz-cards-2-2';
      if (cardCount === 4) return 'quiz-cards-2-2';
      if (cardCount <= 6) return 'quiz-cards-2-3';
      return 'quiz-cards-2-3';
    }

    attachCardListeners() {
      const container = this.container.querySelector('.quiz-cards');
      const isMultiChoice = container.dataset.multiChoice === 'true';
      const nextBtn = document.getElementById('quiz-next-btn');

      container.querySelectorAll('.quiz-card').forEach(card => {
        card.addEventListener('click', () => {
          const cardId = card.dataset.cardId;
          const isExit = card.dataset.exit === 'true';

          if (isMultiChoice) {
            // Toggle selection
            if (this.selectedCards.has(cardId)) {
              this.selectedCards.delete(cardId);
              card.classList.remove('selected');
            } else {
              this.selectedCards.add(cardId);
              card.classList.add('selected');
            }

            // Enable/disable next button
            if (nextBtn) {
              nextBtn.disabled = this.selectedCards.size === 0;
            }
          } else {
            // Single choice - immediate progression
            this.selectedCards.clear();
            this.selectedCards.add(cardId);
            
            // Visual feedback before proceeding
            container.querySelectorAll('.quiz-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            // Small delay for visual feedback
            setTimeout(() => {
              if (isExit) {
                this.handleExit(cardId);
              } else {
                this.handleSelection();
              }
            }, 300);
          }
        });
      });

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.handleSelection();
        });
      }
    }

    handleSelection() {
      // Record choices
      this.selectedCards.forEach(cardId => {
        const card = this.currentQuestion.cards.find(c => c.id === cardId);
        this.choices.push({
          questionId: this.currentQuestion.id,
          cardId: cardId,
          cardLabel: card ? card.title || card.body || cardId : cardId
        });
      });

      // Update path - depth-first navigation
      const firstSelectedCard = this.currentQuestion.cards.find(c => this.selectedCards.has(c.id));
      
      if (firstSelectedCard && firstSelectedCard.questions && firstSelectedCard.questions.length > 0) {
        // Go to sub-question
        this.currentPath.push([this.getCurrentQuestionIndex(), firstSelectedCard.id]);
      } else {
        // Advance to next sibling or parent sibling
        this.advanceToNextQuestion();
      }

      this.saveState();
      this.render();
    }

    getCurrentQuestionIndex() {
      const questions = this.getCurrentQuestionList();
      return questions.findIndex(q => q.id === this.currentQuestion.id);
    }

    getCurrentQuestionList() {
      let questions = this.questions;
      
      for (let i = 0; i < this.currentPath.length - 1; i++) {
        const [qIndex, cardId] = this.currentPath[i];
        const question = questions[qIndex];
        const card = question.cards.find(c => c.id === cardId);
        if (card && card.questions) {
          questions = card.questions;
        }
      }

      return questions;
    }

    advanceToNextQuestion() {
      const questions = this.getCurrentQuestionList();
      const currentIndex = this.getCurrentQuestionIndex();
      
      if (currentIndex + 1 < questions.length) {
        // Update the last path element to point to next question
        if (this.currentPath.length > 0) {
          this.currentPath[this.currentPath.length - 1][0]++;
        } else {
          this.currentPath.push([currentIndex + 1, null]);
        }
      } else {
        // No more siblings, pop up to parent level
        this.currentPath.pop();
        if (this.currentPath.length > 0) {
          this.advanceToNextQuestion();
        }
      }
    }

    handleExit(cardId) {
      const card = this.currentQuestion.cards.find(c => c.id === cardId);
      
      // Record final choice
      this.choices.push({
        questionId: this.currentQuestion.id,
        cardId: cardId,
        cardLabel: card ? card.title || card.body || cardId : cardId
      });

      if (card && card.exitUrl) {
        this.navigateToExit(card.exitUrl);
      } else {
        this.handleCompletion();
      }
    }

    handleCompletion() {
      // Check if there's a default exit in config
      if (this.config.defaultExit) {
        this.navigateToExit(this.config.defaultExit);
      } else {
        this.container.innerHTML = `
          <div class="min-h-screen flex flex-col items-center justify-center text-black">
            <h2 class="text-3xl mb-4">Quiz complete!</h2>
            <p>Thank you for your responses.</p>
          </div>
        `;
        this.clearState();
      }
    }

    navigateToExit(url) {
      const choiceIds = this.choices.map(c => c.cardId).join(',');
      const separator = url.includes('?') ? '&' : '?';
      const exitUrl = `${url}${separator}choices=${encodeURIComponent(choiceIds)}`;
      
      this.clearState();
      window.location.href = exitUrl;
    }
  }

  return {
    create: function(config) {
      return new Quiz(config);
    }
  };
})();

// Initialize on DOM load
(function() {
  // Prevent layout loading from anchoring scroll
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  
  function scrollToTopNow() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const container = document.getElementById('content-container');
    if (container) container.scrollTop = 0;
    // double rAF to ensure after paint/layout
    requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, 0)));
  }
  
  scrollToTopNow();
  
  // Mobile navigation
  document.addEventListener('click', function (e) {
    const hb = document.getElementById('hamburger-btn');
    const overlay = document.getElementById('mobile-nav-overlay');
    const closeBtn = document.getElementById('close-mobile-nav');
    
    if (hb && overlay && e.target.closest('#hamburger-btn')) {
      overlay.classList.remove('hidden');
      hb.classList.add('hidden');
      hb.setAttribute('aria-expanded', 'true');
    }
    
    if (closeBtn && overlay && e.target.closest('#close-mobile-nav')) {
      overlay.classList.add('hidden');
      hb && hb.classList.remove('hidden');
      hb && hb.setAttribute('aria-expanded', 'false');
    }
    
    if (overlay && e.target.closest('#mobile-nav-list a')) {
      overlay.classList.add('hidden');
      hb && hb.classList.remove('hidden');
      hb && hb.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Auto-fill email fields for authenticated users
  const userEmail = document.getElementById('content-container')?.getAttribute('data-user-email');
  if (userEmail) {
    function fillEmailFields() {
      const emailInputs = document.querySelectorAll('input[type="email"]');
      emailInputs.forEach(input => {
        if (!input.value) {
          input.value = userEmail;
          input.classList.add('autofilled');
        }
      });
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fillEmailFields);
    } else {
      fillEmailFields();
    }
  }
})();
