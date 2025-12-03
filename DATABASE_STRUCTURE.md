# Firebase Firestore Database Structure

## Overview

Multi-project platform with users, forms, quizzes, and engagement tracking.

## Collections Structure

### 1. Users Collection (shared across all projects)

```
users/
  {userId}/
    email: "user@example.com"
    createdAt: "2025-12-03T10:30:00Z"
    lastActive: "2025-12-03T10:30:00Z"
    projects: ["photographer", "neurodiv", "aipresszo"]  // Which projects they've accessed
```

### 2. Project-Specific User Data (one collection per project)

```
users_photographer/
  {userId}/
    email: "user@example.com"
    lastActive: "2025-12-03T10:30:00Z"
    isPremium: false
    interests: ["fashion", "analog", "vintage"]
    totalEngagements: 45

users_neurodiv/
  {userId}/
    email: "user@example.com"
    lastActive: "2025-12-03T10:30:00Z"
    isPremium: false
    interests: ["adhd", "autism", "resources"]
    totalEngagements: 12

users_aipresszo/
  {userId}/
    email: "user@example.com"
    isPremium: true
    interests: ["ai-basics", "ai-teaching"]
    completedModules: ["ai-alapok", "ai-oktatasban"]
    totalEngagements: 87
```

### 3. Engagements (subcollection under each project user)

```
users_photographer/
  {userId}/
    engagements/  (subcollection)
      {autoId}/
        timestamp: "2025-12-03T10:30:00Z"
        page: "learn/alapok"
        action: "view_protected_content"
        accessLevel: "logged-in"
        duration: 120  // seconds on page (optional)

users_aipresszo/
  {userId}/
    engagements/
      {autoId}/
        timestamp: "2025-12-03T10:30:00Z"
        page: "quiz/ai-basics"
        action: "quiz_completed"
        score: 85
        quizId: "ai-basics-001"
```

### 4. Forms (project-specific)

```
forms_photographer/
  {formId}/
    type: "contact" | "booking" | "feedback"
    createdAt: "2025-12-03T10:30:00Z"
    fields: {...}

forms_aipresszo/
  {formId}/
    type: "course_signup" | "quiz" | "feedback"
    createdAt: "2025-12-03T10:30:00Z"
    fields: {...}
```

### 5. Form Submissions

```
submissions_photographer/
  {submissionId}/
    formId: "contact-form"
    userId: "{userId}" or null (for anonymous)
    email: "user@example.com"
    timestamp: "2025-12-03T10:30:00Z"
    data: {
      name: "John Doe",
      message: "..."
    }

submissions_aipresszo/
  {submissionId}/
    formId: "quiz-ai-basics"
    userId: "{userId}"
    timestamp: "2025-12-03T10:30:00Z"
    data: {
      score: 85,
      answers: {...}
    }
```

### 6. Quizzes (for gamification)

```
quizzes_aipresszo/
  {quizId}/
    title: "AI Basics Quiz"
    questions: [...]
    passingScore: 70

quiz_attempts_aipresszo/
  {attemptId}/
    quizId: "ai-basics-001"
    userId: "{userId}"
    timestamp: "2025-12-03T10:30:00Z"
    score: 85
    answers: {...}
    passed: true
```

## Why This Structure?

### ✅ Pros:

1. **Separation by project** - Each project has isolated data
2. **Shared user identity** - One user across all projects
3. **Scalable** - Can add new projects easily
4. **Flexible queries** - Easy to query per-project or cross-project
5. **Firestore-optimized** - Uses subcollections for better performance

### Querying Examples:

**Get all user's engagements in photographer project:**

```javascript
db.collection("users_photographer")
  .doc(userId)
  .collection("engagements")
  .orderBy("timestamp", "desc")
  .limit(50);
```

**Get all quiz attempts for a user:**

```javascript
db.collection("quiz_attempts_aipresszo")
  .where("userId", "==", userId)
  .orderBy("timestamp", "desc");
```

**Get all form submissions for a specific form:**

```javascript
db.collection("submissions_photographer")
  .where("formId", "==", "contact-form")
  .orderBy("timestamp", "desc");
```

## Security Rules (Firestore)

**Note:** Firestore rules don't support dynamic collection names with variables. You need to create explicit rules for each project collection.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Shared users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Helper function to check if user owns the document
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }

    // Project-specific user data - PHOTOGRAPHER
    match /users_photographer/{userId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);

      match /engagements/{engagementId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId);
      }
    }

    // Project-specific user data - NEURODIV
    match /users_neurodiv/{userId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);

      match /engagements/{engagementId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId);
      }
    }

    // Project-specific user data - AIPRESSZO
    match /users_aipresszo/{userId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);

      match /engagements/{engagementId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId);
      }
    }

    // Project-specific user data - WEDDINGS
    match /users_weddings/{userId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);

      match /engagements/{engagementId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId);
      }
    }

    // Form submissions - PHOTOGRAPHER
    match /submissions_photographer/{submissionId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    // Form submissions - NEURODIV
    match /submissions_neurodiv/{submissionId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    // Form submissions - AIPRESSZO
    match /submissions_aipresszo/{submissionId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    // Quiz attempts - AIPRESSZO
    match /quiz_attempts_aipresszo/{attemptId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    // Quizzes - AIPRESSZO (read-only for authenticated users)
    match /quizzes_aipresszo/{quizId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins via Firebase Admin SDK
    }
  }
}
```

### Alternative: Wildcard Pattern (Less Secure)

If you want a more flexible approach that automatically covers new projects, you can use a wildcard pattern (but it's less secure):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Match any collection starting with users_
    match /{collection}/{userId}/{document=**} {
      allow read, write: if collection.matches('users_.*')
                        && request.auth != null
                        && request.auth.uid == userId;
    }

    // Match any collection starting with submissions_
    match /{collection}/{submissionId} {
      allow create: if collection.matches('submissions_.*')
                   && request.auth != null;
      allow read: if collection.matches('submissions_.*')
                 && request.auth != null
                 && request.auth.uid == resource.data.userId;
    }
  }
}
```
