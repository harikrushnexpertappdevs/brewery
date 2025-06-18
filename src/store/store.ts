import { configureStore } from '@reduxjs/toolkit';
import breweryReducer from './slices/brewerySlice';

export const store = configureStore({
  reducer: {
    brewery: breweryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;