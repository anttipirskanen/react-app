import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import GameItem from './GameItem';
import GameModal from './GameModal';
import React, {Fragment, useEffect, useState} from 'react';
import {Button, Col, Form, Row, Spinner, Table} from 'react-bootstrap';
import {useAppDispatch, useAppSelector} from 'src/hooks';
import {fetchAll, Game, getGames, isLoading} from './gamesSlice';
import styles from './games.module.scss';

const Games: React.FC = () => {
    const dispatch = useAppDispatch();
    const [show, setShow] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const games = useAppSelector(getGames);
    const loading = useAppSelector(isLoading);

    const tableHeaders = ['id', 'name', 'platforms', 'actions'];

    useEffect(() => {
        if (!games && !loading) {
            dispatch(fetchAll());
        }
    });

    const handleGameSelect = (id: number) => {
        setSelectedId(id);
        setShow(true);
    };

    const handleAddNew = () => {
        setSelectedId(null);
        setShow(true);
    };

    const getSelectedGame = () => {
        if (selectedId && games) {
            return games.find((g) => {
                return g.id == selectedId;
            });
        }
        return null;
    };

    return (
        <div id="games" className={styles.games}>
            <h1>Games</h1>
            {loading && (
                <Row>
                    <Col className="text-center text-success">
                        <Spinner animation="border" role="status" />
                    </Col>
                </Row>
            )}
            {!loading && (
                <Fragment>
                    <Row className="text-end">
                        <Col>
                            <Form.Control
                                onChange={(e) => setSearchText(e.target.value)}
                                type="text"
                                placeholder="Search..."
                            />
                        </Col>
                        <Col>
                            <Button onClick={() => handleAddNew()}>
                                <FontAwesomeIcon icon={faPlus} />
                                <span>Add</span>
                            </Button>
                        </Col>
                    </Row>

                    <Table striped bordered>
                        <thead>
                            <tr>
                                {tableHeaders.map((header: string, i: number) => {
                                    return <th key={i}>{header}</th>;
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {games && games.length == 0 && (
                                <tr>
                                    <td className={styles.status} colSpan={tableHeaders.length}>
                                        No games added
                                    </td>
                                </tr>
                            )}
                            {games &&
                                games
                                    .filter(
                                        (g) =>
                                            g.name.toLowerCase().indexOf(searchText.toLowerCase()) >
                                            -1
                                    )
                                    .map((i: Game) => {
                                        return (
                                            <GameItem
                                                key={`game-${i.id}`}
                                                game={i}
                                                select={handleGameSelect}
                                            />
                                        );
                                    })}
                        </tbody>
                    </Table>
                    <GameModal show={show} setShow={setShow} game={getSelectedGame()} />
                </Fragment>
            )}
        </div>
    );
};

export default Games;
