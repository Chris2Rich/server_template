import {get_page} from "./render.js"
import {initializeApp} from "firebase/app";
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB2gg12t2HPHYQMgSA_Nbe51D-Fe7vxsuk",
    authDomain: "locally-1.firebaseapp.com",
    projectId: "locally-1",
    storageBucket: "locally-1.appspot.com",
    messagingSenderId: "889847940781",
    appId: "1:889847940781:web:de869fe2bb78824610e824",
    measurementId: "G-FMCP5PMFLK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function authorize(req, res) {
    res.writeHead(200, { "Content-Type": "text/json" });
    res.end("{}");
    return;
}