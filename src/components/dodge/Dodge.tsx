import React, {useEffect, useRef} from 'react';
import DodgeGame from 'src/util/dodgeGame';

const Dodge: React.FC = (props) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas: HTMLCanvasElement = canvasRef.current;
        DodgeGame.start(canvas);
    }, []);

    return (
        <div id="canvaspage">
            <h1>Dodge game</h1>
            <p>Start by dragging red square and try to avoid blue squares as long as possible</p>
            <canvas id="canvas" ref={canvasRef} {...props} />
        </div>
    );
};

export default Dodge;
