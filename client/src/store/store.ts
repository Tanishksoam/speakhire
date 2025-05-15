
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import formBuilderReducer from './features/FormBuilderSlice';
import customFormReducer from './features/customFormSlice';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['formBuilder', 'customForm']
};

const rootReducer = combineReducers({
  formBuilder: formBuilderReducer,
  customForm: customFormReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Use a variable to control hot reloading behavior
let hotReloadCount = 0;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Properly ignore all redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 128,
      },
      // Add this to prevent excessive middleware runs
      immutableCheck: { warnAfter: 128 },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Add this to help prevent update loops with hot reloading
if (import.meta.hot) {
  import.meta.hot.accept('./features/FormBuilderSlice', () => {
    if (hotReloadCount > 0) return; // Only reload once
    hotReloadCount++;
    store.replaceReducer(persistedReducer);
  });
}

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

