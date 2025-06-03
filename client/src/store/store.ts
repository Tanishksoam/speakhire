
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import formBuilderReducer from './features/FormBuilderSlice';
import customFormReducer from './features/customFormSlice';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

/**
 * Redux Persist configuration
 * Specifies which slices to persist and where to store them
 */
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['formBuilder', 'customForm']
};

/**
 * Combine all reducers into a single root reducer
 */
const rootReducer = combineReducers({
  formBuilder: formBuilderReducer,
  customForm: customFormReducer,
});

/**
 * Apply persistence to the root reducer
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Configure the Redux store with middleware and dev tools
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Properly ignore all redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 128,
      },
      // Prevent excessive middleware runs
      immutableCheck: { warnAfter: 128 },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

/**
 * Hot module replacement configuration for development
 */
if (import.meta.hot) {
  // Track which modules have been hot reloaded to prevent multiple reloads
  const reloadedModules = new Set<string>();
  
  // Configure hot reloading for FormBuilderSlice
  import.meta.hot.accept('./features/FormBuilderSlice', () => {
    if (!reloadedModules.has('FormBuilderSlice')) {
      reloadedModules.add('FormBuilderSlice');
      store.replaceReducer(persistedReducer);
    }
  });
  
  // Configure hot reloading for customFormSlice
  import.meta.hot.accept('./features/customFormSlice', () => {
    if (!reloadedModules.has('customFormSlice')) {
      reloadedModules.add('customFormSlice');
      store.replaceReducer(persistedReducer);
    }
  });
}

/**
 * Create the Redux persistor for use with PersistGate
 */
export const persistor = persistStore(store);

// Type definitions for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

