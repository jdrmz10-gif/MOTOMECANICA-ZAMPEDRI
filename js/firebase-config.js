const firebaseConfig = {
  apiKey: "AIzaSyBFVqQq5onoq7AgW6gBsA6VQkssXLfxmRw",
  authDomain: "productos-zampedri.firebaseapp.com",
  projectId: "productos-zampedri",
  storageBucket: "productos-zampedri.firebasestorage.app",
  messagingSenderId: "244315593712",
  appId: "1:244315593712:web:3f9bac6cfa5ab66767db35"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();