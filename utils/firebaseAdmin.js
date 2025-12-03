import admin from 'firebase-admin';

// Initialize Firebase Admin (server-side only)
let firebaseAdmin;

export function initializeFirebaseAdmin() {
  if (firebaseAdmin) {
    return firebaseAdmin;
  }

  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });

  return firebaseAdmin;
}

export function getAuth() {
  if (!firebaseAdmin) {
    initializeFirebaseAdmin();
  }
  return admin.auth();
}

export function getFirestore() {
  if (!firebaseAdmin) {
    initializeFirebaseAdmin();
  }
  return admin.firestore();
}

export default admin;
