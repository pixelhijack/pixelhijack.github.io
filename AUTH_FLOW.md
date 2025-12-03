# Authentication Flow Documentation

## Overview

Declarative, manifest-based authentication with passwordless magic links.

## Flow Diagram

```
User → Protected Page → Redirect to /login?redirect=/protected-page
                              ↓
                         Login Page (manifest-based)
                              ↓
                    sendMagicLink(form, redirectTo)
                              ↓
                    POST /auth/send-link {email, redirectTo}
                              ↓
                    Email sent via Resend (magic link)
                              ↓
                    User clicks link → /auth/verify?token=...&redirect=...
                              ↓
                    Client-side: Exchange custom token for ID token
                              ↓
                    POST /auth/session {idToken}
                              ↓
                    Server sets session cookie (authToken)
                              ↓
                    Redirect to original page (/protected-page)
```

## Key Components

### 1. Server-Side (server.js)

#### Protected Route Check

```javascript
// Check authentication and access
const authResult = await verifyAuth(req);
const hasAccess = await checkAccess(authResult.user, currentPage, PROJECT);

// If page requires access but user doesn't have it, redirect to login
if (!hasAccess && currentPage.access) {
  const redirectUrl = `/login?redirect=${encodeURIComponent("/" + pathName)}`;
  return res.redirect(401, redirectUrl);
}
```

#### Magic Link Endpoint

```javascript
POST / auth / send - link;
// Accepts: { email, redirectTo }
// Creates/finds Firebase user
// Generates custom token
// Sends email via Resend with magic link
```

#### Session Cookie Endpoint

```javascript
POST / auth / session;
// Accepts: { idToken }
// Creates session cookie (5 days expiry)
// Returns success
```

### 2. Client-Side Functions (renderTemplate.js)

#### submitForm(formElem, intent)

- Used for **regular form submissions** (contact forms, feedback, etc.)
- Sends to `/form` endpoint
- Saves to Google Sheets
- Sends notification emails

#### sendMagicLink(formElem, redirectTo)

- Used for **authentication/magic links**
- Sends to `/auth/send-link` endpoint
- Handles email input validation
- Shows success/error messages
- Disables/enables submit button

### 3. Declarative Login Page (manifest.json)

```json
{
  "slug": "login",
  "navColor": "white",
  "background": "conceptual/botanic/DSC09953.jpg",
  "tree": {
    "type": "div",
    "class": "flex items-center justify-center min-h-screen",
    "children": [
      {
        "type": "form",
        "onsubmit": "event.preventDefault(); const urlParams = new URLSearchParams(window.location.search); const redirectTo = urlParams.get('redirect') || '/'; sendMagicLink(this, redirectTo);",
        "children": [
          {
            "type": "input",
            "typeAttr": "email",
            "name": "email",
            "placeholder": "your@email.com",
            "required": true
          },
          {
            "type": "button",
            "typeAttr": "submit",
            "content": "Send Magic Link"
          }
        ]
      },
      {
        "type": "div",
        "class": "message"
      }
    ]
  }
}
```

## Statefulness: Query Parameters

The `redirectTo` parameter is passed via **URL query parameters**:

1. **Unauthorized access**: `/learn/alapok` → Redirect to `/login?redirect=/learn/alapok`
2. **Login page reads query param**: `URLSearchParams.get('redirect')`
3. **Magic link includes redirect**: `/auth/verify?token=...&redirect=/learn/alapok`
4. **After auth, redirect back**: User lands on `/learn/alapok` (authenticated)

## Two Separate Form Systems

### Why separate endpoints?

| Feature      | submitForm() → `/form`                     | sendMagicLink() → `/auth/send-link` |
| ------------ | ------------------------------------------ | ----------------------------------- |
| **Purpose**  | Form submissions (contact, feedback, quiz) | Authentication (magic links)        |
| **Backend**  | Google Sheets                              | Firebase Auth                       |
| **Email**    | Notification to admin                      | Magic link to user                  |
| **Data**     | Form fields, checkboxes                    | Email + redirectTo                  |
| **Response** | Success/error message                      | Email sent confirmation             |

### Could they be combined?

**Not recommended** - They serve different purposes:

- Forms collect user data
- Auth verifies user identity

Keeping them separate provides:

- ✅ Clear separation of concerns
- ✅ Different validation logic
- ✅ Different error handling
- ✅ Easier to maintain/debug

## Usage in Manifest

### Example: Custom Login Variation (Future)

```json
{
  "slug": "quiz-login",
  "tree": {
    "type": "form",
    "onsubmit": "event.preventDefault(); sendMagicLink(this, '/quiz/start');",
    "children": [
      {
        "type": "h1",
        "content": "Ready to test your knowledge?"
      },
      {
        "type": "input",
        "typeAttr": "email",
        "placeholder": "Enter email to start quiz"
      }
    ]
  }
}
```

## Advantages of Declarative Approach

1. **Customizable**: Each project can have different login page styles
2. **No hardcoded HTML**: Everything defined in manifest.json
3. **Consistent**: Uses same rendering engine as other pages
4. **Flexible**: Easy to add variations (quiz login, premium login, etc.)
5. **Maintainable**: Change login UI without touching server code

## Future Enhancements

- [ ] Support for different login page variants per project
- [ ] Custom login pages based on `currentPage.loginPage` property
- [ ] Role-based login flows (student vs teacher, free vs premium)
- [ ] Social auth integration (Google, GitHub) alongside magic links
- [ ] Email verification before sending magic link
- [ ] Rate limiting on `/auth/send-link` endpoint
