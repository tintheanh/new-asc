import * as React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/auth';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { APIKEY, AUTHDOMAIN, DATABASEURL, PROJECTID, STORAGEBUCKET, MESSAGINGSENDERID, APPID } from './config';
import { createBrowserHistory } from 'history';
import 'react-table/react-table.css';
import 'react-datepicker/dist/react-datepicker.css';

const firebaseConfig = {
	apiKey: APIKEY,
	authDomain: AUTHDOMAIN,
	databaseURL: DATABASEURL,
	projectId: PROJECTID,
	storageBucket: STORAGEBUCKET,
	messagingSenderId: MESSAGINGSENDERID,
	appId: APPID
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const fbdb = firebase.database();
export const fsdb = firebase.firestore();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
