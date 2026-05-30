import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './slices/sessionSlice';
import { gustoApi } from './services/gustoApi';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    [gustoApi.reducerPath]: gustoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(gustoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
