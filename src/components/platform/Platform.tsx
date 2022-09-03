import {faArrowDown, faArrowLeft, faArrowRight, faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {useEffect, useRef, useState} from 'react';
import {Row, Col, ListGroup, ListGroupItem} from 'react-bootstrap';
import PlatformGame from 'src/util/platformGame';

const Platform: React.FC = (props) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas: HTMLCanvasElement = canvasRef.current;
        //do this to reset game after hot reload
        PlatformGame.stop();
        PlatformGame.start(canvas);
        return () => {
            PlatformGame.stop();
        };
    }, []);

    return (
        <div id="platform">
            <h1>Platform game</h1>
            <Row>
                <Col xl="10" lg="8" md="12">
                    <canvas id="canvas" ref={canvasRef} {...props} />
                </Col>
                <Col>
                    <ListGroup className="w-100">
                        <ListGroupItem>
                            <FontAwesomeIcon icon={faArrowRight} /> <span>Move right</span>
                        </ListGroupItem>
                        <ListGroupItem>
                            <FontAwesomeIcon icon={faArrowLeft} /> <span>Move left</span>{' '}
                        </ListGroupItem>
                        <ListGroupItem>
                            <FontAwesomeIcon icon={faArrowUp} /> <span>Jump</span>{' '}
                        </ListGroupItem>
                        <ListGroupItem>
                            <FontAwesomeIcon icon={faArrowDown} /> <span>Crouch</span>{' '}
                        </ListGroupItem>
                        <ListGroupItem>
                            <strong>ENTER</strong> <span>Restart current level</span>
                        </ListGroupItem>
                    </ListGroup>
                </Col>
            </Row>
        </div>
    );
};

export default Platform;
