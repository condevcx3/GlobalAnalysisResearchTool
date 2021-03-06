import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {createStore} from 'redux';
import { Provider } from 'react-redux'
import {initialState,saveToLocalStorage, loadFromLocalStorage, reducers, enhancer} from './store/reducers/rootReducer';

const persistedState = loadFromLocalStorage();
const store = createStore(reducers, persistedState, enhancer);
store.subscribe(() => saveToLocalStorage(store.getState()))

ReactDOM.render(<Provider store = {store}><App /></Provider>, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
