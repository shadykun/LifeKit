import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCFuWJrRvLMlKeRrEGmyYR69SUx7apS8jQ",
    authDomain: "project-app-database.firebaseapp.com",
    projectId: "project-app-database",
    storageBucket: "project-app-database.appspot.com",
    messagingSenderId: "1010404522171",
    appId: "1:1010404522171:ios:a145f32fa1aed9aac5119e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
