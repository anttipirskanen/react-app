import React, {useEffect, useRef} from 'react';
import DodgeGame from 'src/util/dodgeGame';

const Canvas: React.FC = (props) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas: HTMLCanvasElement = canvasRef.current;
        DodgeGame.start(canvas);
    }, []);

    return (
        <div id="canvaspage">
            <h1>Canvas</h1>
            <canvas id="canvas" ref={canvasRef} {...props} />
        </div>
    );
};

export default Canvas;
