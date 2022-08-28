import React from 'react';
import {Button} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import styles from './gameItem.module.scss';
import {useAppDispatch} from 'src/hooks';
import {remove, Game} from './gamesSlice';

const Game: React.FC<{game: Game; select: Function}> = (props) => {
    const dispatch = useAppDispatch();

    return (
        <tr>
            <td id={`game-${props.game.id}`}>{props.game.id}</td>
            <td>{props.game.name}</td>
            <td>{props.game.platforms.join(', ')}</td>
            <td className={styles.actions}>
                <Button variant="primary" onClick={() => props.select(props.game.id)}>
                    <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button variant="danger" onClick={() => dispatch(remove(props.game.id))}>
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
            </td>
        </tr>
    );
};

export default Game;
