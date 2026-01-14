import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyBkAu8IOZSI8Ap4pSLTC8caBbjAoZDcK2M",
	authDomain: "neodex-chat.firebaseapp.com",
	projectId: "neodex-chat",
	storageBucket: "neodex-chat.firebasestorage.app",
	messagingSenderId: "517986263039",
	appId: "1:517986263039:web:3f1ccbff2daf98289b11ca",
	databaseURL: "https://neodex-chat-default-rtdb.firebaseio.com"
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db: Database = getDatabase(app);
export const auth: Auth = getAuth(app);