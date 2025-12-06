# Quiz Submission with Authentication Flow

## Overview

This document describes how quiz forms with email collection work, creating users, saving data, and sending magic links for authentication.

## Flow Diagram

```
User fills quiz form
      ↓
Clicks Submit
      ↓
submitQuiz() collects form data
      ↓
POST /quiz/submit
      ↓
┌─────────────────────────────────┐
│ 1. Create/Get User (Firebase)   │
│    - Create if new              │
│    - Get existing if email      │
│      already exists             │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│ 2. Save to Firestore            │
│    users/{uid}                  │
│    users_aipresszo/{uid}        │
│    users_aipresszo/{uid}/       │
│      engagements/{id}           │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│ 3. Save to Google Sheets        │
│    (backup/analytics)           │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│ 4. Generate Magic Link          │
│    - Custom token created       │
│    - Email sent via Resend      │
└─────────────────────────────────┘
      ↓
User receives email → Clicks link
      ↓
Authenticated and redirected
```

## Implementation

### 1. Client-Side (Manifest)

**Quiz Form Structure:**

```json
{
  "slug": "quiz/alapok/novicius",
  "tree": {
    "type": "form",
    "onsubmit": "return submitQuiz(this, 'aipresszo', 'alapok_novicius', '/thank-you');",
    "children": [
      {
        "type": "fieldset",
        "children": [
          {
            "type": "input",
            "typeAttr": "checkbox",
            "id": "ai_alapok_mennyire_okos_az_ai",
            "name": "ai_alapok_mennyire_okos_az_ai",
            "data-label": "Mennyire okos az AI? Hogyan nem ért dolgokat?"
          },
          {
            "type": "label",
            "for": "ai_alapok_mennyire_okos_az_ai",
            "content": "Mennyire okos az AI? Hogyan nem ért dolgokat?"
          }
        ]
      },
      {
        "type": "input",
        "name": "email",
        "typeAttr": "email",
        "required": true
      },
      {
        "type": "button",
        "typeAttr": "submit",
        "content": "Submit"
      },
      {
        "type": "div",
        "class": "message mt-4 p-3 rounded-lg hidden"
      }
    ]
  }
}
```

**Function Parameters:**

```javascript
submitQuiz(formElem, projectName, quizId, redirectTo);
```

- `formElem`: The form element (passed as `this`)
- `projectName`: Project identifier (e.g., 'aipresszo', 'neurodiv')
- `quizId`: Unique quiz identifier (e.g., 'alapok_novicius')
- `redirectTo`: URL to redirect after authentication (e.g., '/thank-you')

### 2. Server-Side Endpoint

**POST /quiz/submit**

**Request Payload:**

```json
{
  "email": "user@example.com",
  "projectName": "aipresszo",
  "quizData": {
    "quizId": "alapok_novicius",
    "role": "tanulo",
    "checkboxes": [
      {
        "name": "ai_alapok_mennyire_okos_az_ai",
        "label": "Mennyire okos az AI? Hogyan nem ért dolgokat?"
      },
      {
        "name": "ai_alapok_milyen_feladatokra",
        "label": "Milyen feladatokra használható az AI?"
      }
    ]
  },
  "redirectTo": "/thank-you"
}
```

**Server Actions:**

1. **Create/Get User** (Firebase Auth)

   - Try to get user by email
   - If not exists, create new user
   - Create shared `users/{uid}` document

2. **Save to Firestore**

   ```javascript
   // users_aipresszo/{uid}
   {
     email: "user@example.com",
     createdAt: "2025-12-05T10:30:00Z",
     lastActive: "2025-12-05T10:30:00Z",
     isPremium: false,
     interests: ["Mennyire okos az AI?", "Milyen feladatokra használható az AI?"],
     totalEngagements: 1,
     quizResponses: {
       alapok_novicius: {
         timestamp: "2025-12-05T10:30:00Z",
         quizId: "alapok_novicius",
         role: "tanulo",
         checkboxes: [...]
       }
     }
   }

   // users_aipresszo/{uid}/engagements/{id}
   {
     timestamp: "2025-12-05T10:30:00Z",
     action: "quiz_submission",
     quizId: "alapok_novicius",
     data: { ... }
   }
   ```

3. **Save to Google Sheets** (backup)

   - Timestamp
   - Intent: "aipresszo: quiz"
   - Email
   - Role
   - Checkboxes (JSON stringified)

4. **Send Magic Link**
   - Generate custom token
   - Send email via Resend
   - Include redirect URL

**Response:**

```json
{
  "message": "Quiz submitted! Check your email to continue.",
  "userId": "firebase_user_uid"
}
```

### 3. Data Storage Locations

Quiz responses are stored in **3 places**:

#### A. Firestore (Primary Storage)

**users_aipresszo/{uid}**

```javascript
{
  quizResponses: {
    [quizId]: {
      timestamp: "...",
      ...quizData
    }
  },
  interests: ["topic1", "topic2"]  // Extracted from checkboxes
}
```

**users_aipresszo/{uid}/engagements/{id}**

```javascript
{
  action: "quiz_submission",
  quizId: "alapok_novicius",
  data: { ...quizData }
}
```

**Why both?**

- `quizResponses`: Latest quiz data, easy to query user's current state
- `engagements` subcollection: Full history, timeline of all interactions

#### B. Google Sheets (Backup/Analytics)

Stored in "all forms" sheet with all other form submissions.

**Columns:**

- Timestamp
- Intent: "aipresszo: quiz"
- Email
- Role
- Checkboxes (JSON)

**Why?**

- Backup in case Firestore fails
- Easy to export/analyze in spreadsheet
- Admin can view all submissions without Firebase console

#### C. User Profile (Aggregated)

**users_aipresszo/{uid}**

```javascript
{
  interests: [...]  // Merged from all quiz checkboxes
  totalEngagements: 5  // Incremented on each submission
}
```

## Subsequent Form Submissions

### First Submission (Unauthenticated)

1. User fills form → submits
2. User created in Firebase
3. Magic link sent
4. User clicks link → authenticated
5. Redirected to thank-you page

### Second Submission (Authenticated)

1. User already logged in (session cookie exists)
2. Fills another quiz form
3. Data saved to **same user ID**
4. No magic link needed (already authenticated)
5. Interests array updated (merged with new selections)

### How Server Knows User is Authenticated

In your existing `app.get(/^(.*)$/)` route, you already have:

```javascript
const authResult = await verifyAuth(req);
if (authResult.authenticated) {
  // User is logged in - can access their userId
  const userId = authResult.user.uid;
}
```

For quiz submissions, you can enhance `/quiz/submit` to:

```javascript
app.post("/quiz/submit", async (req, res) => {
  // Check if user is already authenticated
  const authResult = await verifyAuth(req);

  if (authResult.authenticated) {
    // User already logged in - just save data, no magic link
    const userId = authResult.user.uid;
    // Save quiz data to users_aipresszo/{userId}
    // Don't send magic link
  } else {
    // User not logged in - create/get user, send magic link
    // (existing flow)
  }
});
```

## Usage Examples

### Example 1: AI Basics Novice Quiz

**Manifest:**

```json
{
  "slug": "quiz/alapok/novicius",
  "tree": {
    "type": "form",
    "onsubmit": "return submitQuiz(this, 'aipresszo', 'alapok_novicius', '/quiz/results');",
    "children": [...]
  }
}
```

### Example 2: Work-Related AI Quiz

```json
{
  "slug": "quiz/munkaban",
  "tree": {
    "type": "form",
    "onsubmit": "return submitQuiz(this, 'aipresszo', 'munkaban_basics', '/next-step');",
    "children": [...]
  }
}
```

### Example 3: Psychology Quiz

```json
{
  "slug": "quiz/pszichologia",
  "tree": {
    "type": "form",
    "onsubmit": "return submitQuiz(this, 'aipresszo', 'pszichologia_intro', '/resources');",
    "children": [...]
  }
}
```

## Retrieving User Quiz Data

### Get all quizzes for a user:

```javascript
const userDoc = await db.collection("users_aipresszo").doc(userId).get();
const quizResponses = userDoc.data().quizResponses;

// quizResponses = {
//   alapok_novicius: { timestamp: "...", ... },
//   munkaban_basics: { timestamp: "...", ... }
// }
```

### Get user interests (for recommendations):

```javascript
const userDoc = await db.collection("users_aipresszo").doc(userId).get();
const interests = userDoc.data().interests;

// interests = ["AI alapok", "Milyen feladatokra használható", ...]
```

### Get engagement history:

```javascript
const engagements = await db
  .collection("users_aipresszo")
  .doc(userId)
  .collection("engagements")
  .where("action", "==", "quiz_submission")
  .orderBy("timestamp", "desc")
  .get();
```

## Error Handling

### Client-Side

The `submitQuiz()` function shows feedback via the `.message` div:

**Success:**

```html
<div class="message success">Quiz submitted! Check your email to continue.</div>
```

**Error:**

```html
<div class="message error">Error: Failed to submit quiz</div>
```

### Server-Side

Returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (missing email/projectName)
- `500`: Server error (database/email failure)

## Security Considerations

1. **Email Validation**: Email format validated client-side (HTML5 `required` + `type="email"`)
2. **Rate Limiting**: Consider adding rate limiting to prevent spam
3. **Magic Link Expiry**: Custom tokens expire in 1 hour
4. **Session Cookie**: httpOnly, secure (in production), 5-day expiry
5. **Firestore Rules**: Users can only read/write their own data

## Testing

### Test Flow:

1. **Fill form** on `/quiz/alapok/novicius`
2. **Submit** with email `test@example.com`
3. **Check DevTools Network tab** - should see POST to `/quiz/submit`
4. **Check response** - should get `{message: "Quiz submitted!", userId: "..."}`
5. **Check email** - should receive magic link
6. **Click link** - should authenticate and redirect to `/quiz/results`
7. **Check Firestore** - user document should exist in `users_aipresszo`
8. **Check Google Sheets** - row should be added

### Test Authenticated Submission:

1. Already logged in user
2. Fill another quiz
3. Submit
4. Should save to existing user document
5. Should NOT send magic link
6. Interests array should be updated with new selections

## Next Steps

1. ✅ Implement `/quiz/submit` endpoint
2. ✅ Add `submitQuiz()` client function
3. ✅ Update manifest to use new function
4. ⏳ Test full flow
5. ⏳ Add authenticated user check (skip magic link if logged in)
6. ⏳ Create thank-you/results pages
7. ⏳ Build recommendation engine based on interests
