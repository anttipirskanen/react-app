import React, {useEffect, useState} from 'react';
import {Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useAppDispatch, useAppSelector} from 'src/hooks';
import {add, Game, getGames, update} from 'src/features/games/gamesSlice';

const GameModal: React.FC<{show: boolean; setShow: Function; game?: Game}> = (props) => {
    const availablePlatforms = ['PC', 'XBOXONE', 'PS4', 'PS5'];
    const dispatch = useAppDispatch();
    const [name, setName] = useState<string>('');
    const [platforms, setPlatforms] = useState<string[]>([]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (props.game) {
            dispatch(update({id: props.game.id, name, platforms}));
        } else {
            dispatch(add({name, platforms}));
        }
        props.setShow(false);
    };

    useEffect(() => {
        if (props.game) {
            setName(props.game.name);
            setPlatforms(props.game.platforms);
        } else {
            setName('');
            setPlatforms([]);
        }
    }, [props.game]);

    return (
        <Modal show={props.show} onHide={() => props.setShow(false)}>
            <Form onSubmit={(e) => handleSubmit(e)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {!props.game ? 'Add new game' : 'Edit game #' + props.game.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Enter name"
                            required
                            value={name}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPlatforms">
                        <Form.Label>Platforms</Form.Label>
                        <Form.Select
                            multiple
                            required
                            onChange={(e) => {
                                const value = [];
                                for (var i = 0, l = e.target.options.length; i < l; i++) {
                                    if (e.target.options[i].selected) {
                                        value.push(e.target.options[i].value);
                                    }
                                }
                                setPlatforms(value);
                            }}
                            value={platforms}
                        >
                            {availablePlatforms.map((p, i) => (
                                <option key={i} value={p}>
                                    {p}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => props.setShow(false)}>
                        Close
                    </Button>
                    <Button type="submit" variant="primary">
                        Save
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default GameModal;
