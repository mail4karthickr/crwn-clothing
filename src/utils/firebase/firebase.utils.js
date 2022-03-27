import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';

import {
    getFirestore,
    doc,
    getDoc,
    setDoc
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBpWcp6bJP5UYH33VxCgBb_nZzfE815ajM",
    authDomain: "crwn-db-490a1.firebaseapp.com",
    projectId: "crwn-db-490a1",
    storageBucket: "crwn-db-490a1.appspot.com",
    messagingSenderId: "122767910705",
    appId: "1:122767910705:web:8f75e807b3315dee54f210"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
      prompt: "select_account"
  });
  export const auth = getAuth();
  export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

  export const db = getFirestore();

  export const createUserDocumentFromAuth = async (userAuth) => {
      const userDocRef = doc(db, 'users', userAuth.uid);
      console.log(userDocRef);
      const userSnapshot = await getDoc(userDocRef);
      if (!userSnapshot.exists()) {
          const { displayName, email } = userAuth;
          const createdAt = new Date();
          try {
              await setDoc(userDocRef, {
                  displayName,
                  email,
                  createdAt
              });
          } catch (error) {
            console.log('error creating the user', error.message);  
          }
      }
      return userDocRef
  }