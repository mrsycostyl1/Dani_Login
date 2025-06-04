
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyB1Y3v-ui6PtDh94zGpO3EmcciJPRITPro",
  authDomain: "my-air-899a7.firebaseapp.com",
  databaseURL: "https://my-air-899a7-default-rtdb.firebaseio.com",
  projectId: "my-air-899a7",
  storageBucket: "my-air-899a7.appspot.com",
  messagingSenderId: "739001861292",
  appId: "1:739001861292:web:0b885a5269b67eb1f88b09"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Set session persistence
setPersistence(auth, browserLocalPersistence);

// DOM Elements
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const welcomeBox = document.getElementById("welcome-box");

// Signup
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const displayName = e.target.displayName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email,
        displayName,
        createdAt: new Date().toISOString()
      });
      alert("Signup successful!");
      signupForm.reset();
    } catch (error) {
      alert(error.message);
    }
  });
}

// Login
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      loginForm.reset();
    } catch (error) {
      alert(error.message);
    }
  });
}

// Update UI on Auth Change
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const profile = docSnap.data();
        welcomeBox.innerHTML = `
          <h2>Welcome, {profile.displayName}</h2>
          <p>Email: {profile.email}</p>
          <button id="logout-btn">Logout</button>
        `;
        document.getElementById("logout-btn").addEventListener("click", () => signOut(auth));
      } else {
        welcomeBox.innerHTML = "<p>User profile not found.</p>";
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      welcomeBox.innerHTML = "<p>Error loading profile.</p>";
    }
  } else {
    welcomeBox.innerHTML = "<p>Please log in or sign up.</p>";
  }
});
