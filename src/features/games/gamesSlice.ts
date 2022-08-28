import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import gamesApi from 'src/api/gamesApi';
import {RootState} from '../../store/store';

export type Game = {
    id: number;
    name: string;
    platforms: Array<string>;
};

export interface INewGame {
    name: string;
    platforms: string[];
}

export type GamesState = {
    values: Game[];
    loading: boolean;
    error: Error;
};

const initialState: GamesState = {
    values: null,
    loading: false,
    error: null
};

export const fetchAll = createAsyncThunk('games/fetchAll', async () => {
    return await gamesApi.fetchAll();
});

export const gamesSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {
        add: (state, action: PayloadAction<INewGame>) => {
            let id = 1;
            if (state.values.length > 0) {
                id = state.values[state.values.length - 1].id + 1;
            }
            const newGame: Game = {
                ...action.payload,
                id
            };
            state.values.push(newGame);
        },
        update: (state, action: PayloadAction<Game>) => {
            for (var i = state.values.length - 1; i >= 0; --i) {
                if (state.values[i].id == action.payload.id) {
                    state.values[i] = action.payload;
                }
            }
        },
        remove: (state, action: PayloadAction<number>) => {
            for (var i = state.values.length - 1; i >= 0; --i) {
                if (state.values[i].id == action.payload) {
                    state.values.splice(i, 1);
                }
            }
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchAll.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAll.fulfilled, (state, action) => {
            state.loading = false;
            state.values = action.payload;
        });
        builder.addCase(fetchAll.rejected, (state) => {
            state.loading = false;
            state.values = [];
            state.error = new Error('Error');
        });
    }
});

export const {add, update, remove} = gamesSlice.actions;
export const getGames = (state: RootState): Game[] => state.games.values;
export const isLoading = (state: RootState): boolean => state.games.loading;

export default gamesSlice.reducer;
