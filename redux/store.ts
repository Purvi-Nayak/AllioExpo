// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import { PersistConfig, persistReducer, persistStore } from 'redux-persist';

// import authReducer from './slices/AuthSlice';

// const rootReducer = combineReducers({
//   auth: authReducer,

// });

// type RootReducerType = ReturnType<typeof rootReducer>;

// const persistConfig: PersistConfig<RootReducerType> = {
//   key: 'Allio_root',
//   storage: AsyncStorage,
//   whitelist: ['auth', 'language', 'theme'],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,

// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { configureStore } from "@reduxjs/toolkit";
// import { persistReducer, persistStore } from "redux-persist";
// import authSlice from "./slices/AuthSlice";

// const persistConfig = {
//   key: "root",
//   storage: AsyncStorage,
// };

// const persistedAuthReducer = persistReducer(persistConfig, authSlice);

// export const store = configureStore({
//   reducer: {
//     auth: persistedAuthReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
//       },
//     }),
// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import authSlice from "./slices/AuthSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth"], // Only persist auth slice
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PURGE",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
