import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyCuuOXKkEblaT6PSVk7kY5jOoCQCWi1yAA",
    authDomain: "reactapp-4d97a.firebaseapp.com",
    databaseURL: "https://reactapp-4d97a.firebaseio.com",
    projectId: "reactapp-4d97a",
    storageBucket: "reactapp-4d97a.appspot.com",
    messagingSenderId: "1064929593000",
    appId: "1:1064929593000:web:9cffabe12b8df630"
  };
  // Initialize Firebase
 

class Firebase{
    constructor(){
        app.initializeApp(firebaseConfig);
        //referenciando database para acessar em outros locais
        this.app = app.database();
        this.storage = app.storage();

    }

    login(email, password){
        return app.auth().signInWithEmailAndPassword(email, password)
    }

    logout(){
        return app.auth().signOut();
    }

    async register(nome, email, password){
        await app.auth().createUserWithEmailAndPassword(email, password)
        const uid = app.auth().currentUser.uid;

        return app.database().ref('usuarios').child(uid).set({
            nome: nome
        })
    }

    isInitialized(){
        return new Promise(resolve =>{
            app.auth().onAuthStateChanged(resolve);
        })
    }

    getCurrent(){
        return app.auth().currentUser && app.auth().currentUser.email
    }

    getUid(){
        return app.auth().currentUser && app.auth().currentUser.uid
    }

    async getUserName(callback){
        if(!app.auth().currentUser){
            return null;
        }
        const uid = app.auth().currentUser.uid;

        await app.database().ref('usuarios').child(uid)
        .once('value').then(callback);
    }


}

export default new Firebase;