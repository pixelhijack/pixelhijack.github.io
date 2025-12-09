import admin from 'firebase-admin';

// Initialize Firebase Admin (server-side only)
let firebaseAdmin;

export function initializeFirebaseAdmin() {
  if (firebaseAdmin) {
    return firebaseAdmin;
  }

  // Check for environment variable
  const credentialsJson = process.env.FIREBASE_SERVICE_ACCOUNT || process.env.GOOGLE_CREDENTIALS;
  
  if (!credentialsJson) {
    console.error('❌ Missing Firebase credentials! Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_CREDENTIALS environment variable.');
    throw new Error('Firebase credentials not found in environment variables');
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(credentialsJson);
  } catch (error) {
    console.error('❌ Failed to parse Firebase credentials JSON:', error.message);
    throw new Error('Invalid Firebase credentials JSON');
  }

  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });

  console.log('✅ Firebase Admin initialized for project:', serviceAccount.project_id);

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
