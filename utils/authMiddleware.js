import { getAuth, getFirestore } from './firebaseAdmin.js';
import admin from './firebaseAdmin.js';

// Verify Firebase session cookie
export async function verifyAuth(req) {
  const sessionCookie = req.cookies?.authToken;
  
  if (!sessionCookie) {
    return { authenticated: false, user: null };
  }

  try {
    // Verify session cookie instead of ID token
    const decodedToken = await getAuth().verifySessionCookie(sessionCookie, true);
    return {
      authenticated: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
      }
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    return { authenticated: false, user: null };
  }
}

// Check if user has access to a page
export async function checkAccess(user, page, projectName) {
  const accessLevel = page.access || 'public';
  
  if (accessLevel === 'public' || !accessLevel) {
    return true;
  }

  if (!user) {
    return false;
  }

  if (accessLevel === 'logged-in') {
    return true; // User is authenticated
  }

  // For future payment-based access levels
  if (accessLevel === 'premium') {
    const db = getFirestore();
    const userDoc = await db
      .collection(`users_${projectName}`)
      .doc(user.uid)
      .get();
    
    return userDoc.exists && userDoc.data().isPremium === true;
  }

  return false;
}

// Track user engagement
export async function trackEngagement(userId, projectName, data) {
  const db = getFirestore();
  const userRef = db.collection(`users_${projectName}`).doc(userId);
  
  try {
    await userRef.set({
      email: data.email,
      lastActive: new Date().toISOString(),
      engagements: admin.firestore.FieldValue.arrayUnion({
        timestamp: new Date().toISOString(),
        page: data.page,
        action: data.action,
      }),
      interests: data.interests || [],
    }, { merge: true });
  } catch (error) {
    console.error('Failed to track engagement:', error);
  }
}
