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
