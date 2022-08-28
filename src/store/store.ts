import {combineReducers, configureStore} from '@reduxjs/toolkit';
import gamesReducer from '../features/games/gamesSlice';

const rootReducer = combineReducers({
    games: gamesReducer
});

export const store = configureStore({
    reducer: rootReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
