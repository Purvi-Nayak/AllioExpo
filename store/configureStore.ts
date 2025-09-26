import {configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';

import localState from './interceptor/localState'; // keep if needed
import reducer from './reducer';
import api from './interceptor/api';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  timeout: 0,
};

const middlewareConfig = {
  serializableCheck: false,
  immutableCheck: false,
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware(middlewareConfig).concat(api, localState), // removed api
  });
};

export default store;
