import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,
    writeBatch,
    query,
    getDocs
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
  export const signInWithGoogleRedirect = () => signInWithRedirect(auth, provider);

  export const db = getFirestore();

  export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
      const collectionRef = collection(db, collectionKey);
      const batch = writeBatch(db);

      objectsToAdd.forEach(object => {
          const docRef = doc(collectionRef, object.title.toLowerCase());
          batch.set(docRef, object);
      })

      await batch.commit();
      console.log("done");
  }

  export const createUserDocumentFromAuth = async (
      userAuth, 
      additionalInformation = {}
    ) => {
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
                  createdAt,
                  ...additionalInformation
              });
          } catch (error) {
            console.log('error creating the user', error.message);  
          }
      }
      return userDocRef
  }

  export const createAuthUserWithEmailAndPassword = async (email, password) => {
      if (!email || !password) return; 
      return await createUserWithEmailAndPassword(auth, email, password);
  }

  export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return; 
    return await signInWithEmailAndPassword(auth, email, password);
}

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);

export const getCategoriesAndDocuments = async () => {
    const collectionRef = collection(db, 'categories');
    const q = query(collectionRef);

    const querySnapshot = await getDocs(q);
    const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
        const { title, items } = docSnapshot.data();
        acc[title.toLowerCase()] = items;
        return acc;
    }, {});

    return categoryMap;
}