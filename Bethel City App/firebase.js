import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, getDoc, getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCxLD99cJ7kFjTYuYtGojh-xUHnN9qWy5g",
  authDomain: "temp-4710d.firebaseapp.com",
  projectId: "temp-4710d",
  storageBucket: "temp-4710d.appspot.com",
  messagingSenderId: "582389462230",
  appId: "1:582389462230:web:93cf2dab7757d7156bc577",
  measurementId: "G-SSTT518BCY"
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();


let auth;
try {
  auth = getAuth(app);
} catch (e) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, getDoc, getDocs, collection, doc, updateDoc };
