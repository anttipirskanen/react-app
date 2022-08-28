import {Game} from '../features/games/gamesSlice';

const games: Array<Game> = [
    {
        id: 1,
        name: 'God of War',
        platforms: ['PS4', 'PS5', 'PC']
    },
    {
        id: 2,
        name: 'Bloodborne',
        platforms: ['PS4', 'PS5']
    }
];

const fetchAll = (): Promise<Array<Game>> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(games);
        }, 2000);
    });
};

export default {fetchAll};
