import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBejE1CDLjaI1yhS-dxAfZDtD4EdPqI1hg",
  authDomain: "foodagro-797c5.firebaseapp.com",
  projectId: "foodagro-797c5",
  storageBucket: "foodagro-797c5.appspot.com",
  messagingSenderId: "992116837549",
  appId: "1:992116837549:web:d2f712caa5bcac67ea0a24"
};

firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();

export default storage;