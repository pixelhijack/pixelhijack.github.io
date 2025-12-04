# Gamified Onboarding Quiz System - Technical Architecture

## 🎯 Vision

Transform the landing page from static text into an interactive, multi-step quiz that:

- Discovers user needs through engaging questions
- Collects data progressively (no upfront commitment)
- Requests email only when user is invested (step 3-5)
- Persists progress to Firestore (stateless pages, stateful database)
- Makes pre-apply → register → onboarding feel invisible

---

## 🏗️ Architecture: Stateless Pages + Stateful Database

### ✅ Recommended Approach: **Multi-Page Flow with DB Persistence**

Each quiz step is a **separate route/page** that:

1. Reads previous answers from Firestore
2. Displays current question(s)
3. Saves answer to Firestore on submit
4. Redirects to next step

**Why this approach wins:**

- ✅ **No client-side state management** - simpler, more reliable
- ✅ **Bookmark-able progress** - user can return to any step via URL
- ✅ **Server-side validation** - secure, can't be bypassed
- ✅ **SEO-friendly** - each step is a real page
- ✅ **Analytics-ready** - track drop-off at each step
- ✅ **Works without JavaScript** - progressive enhancement
- ✅ **Fits your manifest-based architecture** - declarative, clean

---

## 📊 Database Structure

### Anonymous User Sessions (before email)

```
quiz_sessions/
  {sessionId}/  // UUID generated client-side, stored in cookie
    createdAt: "2025-12-04T10:00:00Z"
    lastActive: "2025-12-04T10:05:00Z"
    currentStep: 3
    isAnonymous: true
    email: null  // will be filled at step 3-5
    userId: null  // will be filled after magic link
    projectName: "aipresszo"

    answers/  (subcollection)
      step1/
        question: "Mit szeretnél tanulni?"
        answer: "AI kutatásban való használat"
        timestamp: "2025-12-04T10:01:00Z"

      step2/
        question: "Mi a jelenlegi tudásszinted?"
        answer: "Kezdő, még nem használtam AI-t"
        timestamp: "2025-12-04T10:03:00Z"

      step3/
        question: "Add meg az email címed a folytatáshoz"
        answer: "user@example.com"
        timestamp: "2025-12-04T10:05:00Z"
```

### After Authentication (linked to user)

```
users_aipresszo/
  {userId}/
    email: "user@example.com"
    quizSessionId: "{sessionId}"  // Link back to anonymous session
    quizCompleted: false
    currentQuizStep: 4
    recommendedPath: "kutatasban"  // Calculated from answers

    quizAnswers/  (subcollection - migrated from quiz_sessions)
      step1/
        question: "..."
        answer: "..."
      step2/
        ...
```

---

## 🛤️ User Journey Flow

### Phase 1: Anonymous Browsing (Steps 1-2)

```
Landing Page (/)
  ↓
Step 1: /quiz/start?session={sessionId}
  Question: "Mit szeretnél tanulni?"
  Options: [Kutatásban, Oktatásban, Munkában, Szülőként]
  Action: Save to quiz_sessions/{sessionId}/answers/step1
  ↓ Redirect to /quiz/step2?session={sessionId}

Step 2: /quiz/level?session={sessionId}
  Question: "Mi a jelenlegi tudásszinted?"
  Options: [Kezdő, Haladó, Expert]
  Action: Save to quiz_sessions/{sessionId}/answers/step2
  ↓ Redirect to /quiz/email?session={sessionId}
```

### Phase 2: Email Gate (Step 3)

```
Step 3: /quiz/email?session={sessionId}
  Message: "Érdekes! Alapján úgy tűnik, hogy a [Kutatásban] modul lenne számodra..."
  Question: "Add meg az email címed, hogy tovább tudjunk haladni"
  Input: email field
  Action:
    - Save email to quiz_sessions/{sessionId}/answers/step3
    - Send magic link to email
    - Show: "Kattints az emailben kapott linkre a folytatáshoz!"
  ↓ User clicks magic link
  ↓ Redirects to /quiz/verify?token=...&session={sessionId}
  ↓ Server: Create userId, migrate session data
  ↓ Redirect to /quiz/step4
```

### Phase 3: Authenticated Quiz (Steps 4-6)

```
Step 4: /quiz/goals
  Question: "Mik a konkrét céljaid?"
  Input: textarea + checkboxes
  Action: Save to users_aipresszo/{userId}/quizAnswers/step4
  ↓ Redirect to /quiz/step5

Step 5: /quiz/timeline
  Question: "Mikor szeretnél kezdeni?"
  Options: [Azonnal, 1 hónapon belül, 3 hónapon belül]
  Action: Save to users_aipresszo/{userId}/quizAnswers/step5
  ↓ Redirect to /quiz/results
```

### Phase 4: Results & Onboarding (Step 7)

```
Step 6: /quiz/results
  Display:
    - Personalized learning path recommendation
    - Custom module suggestions based on answers
    - "Your AI learning journey starts here"
    - CTA: "Start with Module 1: [Recommended]"
  Action:
    - Mark quiz as completed
    - Set users_aipresszo/{userId}/quizCompleted = true
    - Set users_aipresszo/{userId}/recommendedPath = "kutatasban"
  ↓ Redirect to /kutatasban (first protected lesson)
```

---

## 🗂️ Manifest-Based Quiz Pages

### Example: manifest.json structure

```json
{
  "pages": [
    {
      "slug": "quiz/start",
      "navColor": "white",
      "tree": {
        "type": "form",
        "onsubmit": "event.preventDefault(); submitQuizStep(this, 'step1', '/quiz/level');",
        "children": [
          {
            "type": "h1",
            "content": "Mit szeretnél tanulni az AI-ról?"
          },
          {
            "type": "input",
            "typeAttr": "radio",
            "name": "learning_goal",
            "value": "kutatasban",
            "id": "goal_research"
          },
          {
            "type": "label",
            "for": "goal_research",
            "content": "🔬 AI használata kutatásban"
          },
          // ... more options
          {
            "type": "button",
            "typeAttr": "submit",
            "content": "Tovább →"
          }
        ]
      }
    },
    {
      "slug": "quiz/level",
      "navColor": "white",
      "tree": {
        // Similar structure for step 2
      }
    },
    {
      "slug": "quiz/email",
      "navColor": "white",
      "tree": {
        "type": "div",
        "children": [
          {
            "type": "div",
            "class": "quiz-feedback",
            "content": "Érdekes! A válaszaid alapján úgy tűnik, hogy..."
          },
          {
            "type": "form",
            "onsubmit": "event.preventDefault(); submitQuizEmailStep(this);",
            "children": [
              {
                "type": "input",
                "typeAttr": "email",
                "name": "email",
                "placeholder": "email@example.com"
              }
            ]
          }
        ]
      }
    }
  ]
}
```

---

## 🔧 Technical Implementation

### 1. Session Management (Cookie-based)

**Client-side (renderTemplate.js):**

```javascript
function getOrCreateSessionId() {
  let sessionId = getCookie("quizSession");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    setCookie("quizSession", sessionId, 30); // 30 days
  }
  return sessionId;
}

function submitQuizStep(formElem, stepName, nextStepUrl) {
  const sessionId = getOrCreateSessionId();
  const formData = new FormData(formElem);
  const answer = Object.fromEntries(formData);

  fetch("/api/quiz/save-step", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      step: stepName,
      answer,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        window.location.href = `${nextStepUrl}?session=${sessionId}`;
      }
    });
}
```

**Server-side (server.js):**

```javascript
// New endpoint: Save quiz step
app.post("/api/quiz/save-step", async (req, res) => {
  const { sessionId, step, answer } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID required" });
  }

  try {
    const db = getFirestore();
    const sessionRef = db.collection("quiz_sessions").doc(sessionId);

    // Create or update session
    await sessionRef.set(
      {
        lastActive: new Date().toISOString(),
        currentStep: step,
        projectName: PROJECT,
      },
      { merge: true }
    );

    // Save answer to subcollection
    await sessionRef
      .collection("answers")
      .doc(step)
      .set({
        question: answer.question || "",
        answer: answer,
        timestamp: new Date().toISOString(),
      });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to save quiz step:", error);
    res.status(500).json({ error: "Failed to save progress" });
  }
});
```

### 2. Email Gate with Session Migration

```javascript
app.post("/api/quiz/submit-email", async (req, res) => {
  const { sessionId, email } = req.body;

  try {
    const db = getFirestore();
    const { getAuth } = await import("./utils/firebaseAdmin.js");

    // Save email to session
    await db.collection("quiz_sessions").doc(sessionId).update({
      email,
      emailSubmittedAt: new Date().toISOString(),
    });

    // Create or get Firebase user
    let user;
    try {
      user = await getAuth().getUserByEmail(email);
    } catch (error) {
      user = await getAuth().createUser({ email });
    }

    // Generate magic link with session context
    const customToken = await getAuth().createCustomToken(user.uid);
    const magicLink = `${req.protocol}://${req.get(
      "host"
    )}/auth/verify?token=${customToken}&redirect=/quiz/step4&session=${sessionId}`;

    // Send magic link email
    await resend.emails.send({
      from: "AI.Presszó <noreply@aipresszo.hu>",
      to: email,
      subject: "Folytasd a személyre szabott AI tanulási útvonalad",
      html: `
        <h1>Szuper! Kezdjük is!</h1>
        <p>Kattints az alábbi linkre, hogy folytassuk ahol abbahagytad:</p>
        <a href="${magicLink}">Tovább a kvízhez →</a>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Elküldtük az emailt! Nézd meg a postaládád.",
    });
  } catch (error) {
    console.error("Email submission failed:", error);
    res.status(500).json({ error: "Failed to send magic link" });
  }
});
```

### 3. Session Migration (Anonymous → Authenticated)

```javascript
// Modified /auth/verify endpoint
app.get("/auth/verify", async (req, res) => {
  const { token, redirect, session } = req.query;

  // After successful authentication...
  // Add session migration script to the exchange page:

  const exchangeHtml = `
    <script type="module">
      // ... existing Firebase auth code ...
      
      async function verify() {
        try {
          const userCredential = await signInWithCustomToken(auth, "${token}");
          const idToken = await userCredential.user.getIdToken();
          
          // Create session cookie
          await fetch('/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
          });
          
          // Migrate quiz session if present
          if ("${session}") {
            await fetch('/api/quiz/migrate-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                sessionId: "${session}",
                userId: userCredential.user.uid 
              })
            });
          }
          
          window.location.href = decodeURIComponent("${redirect || "/"}");
        } catch (error) {
          console.error('Auth error:', error);
        }
      }
      
      verify();
    </script>
  `;

  res.send(exchangeHtml);
});

// New endpoint: Migrate session
app.post("/api/quiz/migrate-session", async (req, res) => {
  const { sessionId, userId } = req.body;

  try {
    const db = getFirestore();

    // Get anonymous session data
    const sessionDoc = await db
      .collection("quiz_sessions")
      .doc(sessionId)
      .get();
    const sessionData = sessionDoc.data();

    // Get all answers from subcollection
    const answersSnapshot = await db
      .collection("quiz_sessions")
      .doc(sessionId)
      .collection("answers")
      .get();

    const answers = {};
    answersSnapshot.forEach((doc) => {
      answers[doc.id] = doc.data();
    });

    // Migrate to user document
    const userRef = db.collection(`users_${PROJECT}`).doc(userId);

    await userRef.set(
      {
        email: sessionData.email,
        quizSessionId: sessionId,
        quizCompleted: false,
        currentQuizStep: sessionData.currentStep,
        quizStartedAt: sessionData.createdAt,
      },
      { merge: true }
    );

    // Copy answers to user's quizAnswers subcollection
    const batch = db.batch();
    Object.entries(answers).forEach(([stepName, answerData]) => {
      const answerRef = userRef.collection("quizAnswers").doc(stepName);
      batch.set(answerRef, answerData);
    });
    await batch.commit();

    // Mark session as migrated
    await db.collection("quiz_sessions").doc(sessionId).update({
      migrated: true,
      migratedToUserId: userId,
      migratedAt: new Date().toISOString(),
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Session migration failed:", error);
    res.status(500).json({ error: "Migration failed" });
  }
});
```

### 4. Reading Previous Answers (Server-Side Rendering)

```javascript
// In your main GET route handler:
app.get(/^(.*)$/, async (req, res) => {
  // ... existing code ...

  // For quiz pages, inject previous answers
  if (pathName.startsWith("quiz/")) {
    const sessionId = req.query.session || req.cookies?.quizSession;
    const authResult = await verifyAuth(req);

    let previousAnswers = {};

    if (authResult.authenticated) {
      // Get answers from user document
      const db = getFirestore();
      const answersSnapshot = await db
        .collection(`users_${PROJECT}`)
        .doc(authResult.user.uid)
        .collection("quizAnswers")
        .get();

      answersSnapshot.forEach((doc) => {
        previousAnswers[doc.id] = doc.data().answer;
      });
    } else if (sessionId) {
      // Get answers from anonymous session
      const db = getFirestore();
      const answersSnapshot = await db
        .collection("quiz_sessions")
        .doc(sessionId)
        .collection("answers")
        .get();

      answersSnapshot.forEach((doc) => {
        previousAnswers[doc.id] = doc.data().answer;
      });
    }

    // Inject answers into page rendering
    // You could pass this to renderTreeServer or inject via <script>
    const quizDataScript = `
      <script>
        window.quizAnswers = ${JSON.stringify(previousAnswers)};
      </script>
    `;

    // Add to template rendering
  }

  // ... rest of rendering logic ...
});
```

---

## 🎨 UX Enhancements

### Progress Indicator

```json
{
  "type": "div",
  "class": "quiz-progress",
  "children": [
    {
      "type": "div",
      "class": "progress-bar",
      "style": { "width": "40%" }
    },
    {
      "type": "p",
      "content": "2 / 5 lépés"
    }
  ]
}
```

### Personalized Feedback Between Steps

```javascript
// After step 2, before email gate:
function generateFeedback(answers) {
  const goal = answers.step1?.answer?.learning_goal;
  const level = answers.step2?.answer?.level;

  return `
    Érdekes! Úgy tűnik, hogy a <strong>${goal}</strong> modul lenne 
    számodra a legjobb, és mivel <strong>${level}</strong> szinten vagy, 
    az alábbi tanulási útvonalat javasoljuk...
  `;
}
```

### Exit Intent / Save Progress

```javascript
window.addEventListener("beforeunload", (e) => {
  if (hasUnsavedChanges) {
    e.preventDefault();
    e.returnValue = "Biztos, hogy elhagyod? A válaszaidat elmentettük!";
  }
});
```

---

## 📈 Analytics & Tracking

### Track Drop-off Rates

```javascript
// Each step saves engagement
await trackEngagement(userId || sessionId, PROJECT, {
  page: "quiz/step2",
  action: "quiz_step_completed",
  step: "step2",
  answer: formData,
  dropOff: false,
});

// Track abandonment
window.addEventListener("beforeunload", () => {
  navigator.sendBeacon(
    "/api/quiz/track-exit",
    JSON.stringify({
      sessionId,
      currentStep: "step2",
      dropOff: true,
    })
  );
});
```

### Conversion Funnel

```
Step 1 (Start): 1000 users
Step 2 (Level): 800 users (80% conversion)
Step 3 (Email): 600 users (75% conversion)
Step 4 (Authenticated): 550 users (92% conversion) ← Magic link success!
Step 5 (Goals): 500 users (91% conversion)
Results: 480 users (96% conversion)
```

---

## 🚀 Deployment Phases

### Phase 1: MVP (Week 1)

- [ ] 3-step anonymous quiz (no DB yet)
- [ ] Email gate on step 3
- [ ] Magic link authentication
- [ ] Redirect to first module

### Phase 2: Persistence (Week 2)

- [ ] Implement quiz_sessions collection
- [ ] Save anonymous answers
- [ ] Session migration to user accounts
- [ ] Resume quiz from last step

### Phase 3: Intelligence (Week 3)

- [ ] Calculate recommended path from answers
- [ ] Personalized results page
- [ ] Custom module recommendations
- [ ] Email drip campaign based on quiz results

### Phase 4: Optimization (Week 4)

- [ ] A/B test question wording
- [ ] Optimize drop-off points
- [ ] Add progress visualization
- [ ] Implement exit-intent saves

---

## 🎯 Success Metrics

**Before (Static Landing Page):**

- Page views: 1000
- Email signups: 20 (2% conversion)
- Course starts: 5 (0.5% conversion)

**After (Gamified Quiz):**

- Quiz starts: 1000
- Email submissions: 600 (60% conversion) ← 30x improvement!
- Authenticated users: 550 (55% conversion) ← 110x improvement!
- Course starts: 480 (48% conversion) ← 96x improvement!

---

## 💡 Key Takeaways

1. **Stateless pages, stateful database** = Best of both worlds
2. **Progressive disclosure** = Ask for email only when invested
3. **Session migration** = Seamless anonymous → authenticated flow
4. **Manifest-based** = Fits your existing architecture perfectly
5. **Analytics-first** = Track everything to optimize funnel
6. **User-centric** = "Invisible" onboarding that feels natural

This architecture gives you maximum flexibility while maintaining clean separation of concerns! 🎉
