interface GameObject {
    color: string;
    width: number;
    height: number;
    x: number;
    y: number;
}

interface Player extends GameObject {
    dragging: boolean;
}

interface Enemy extends GameObject {
    moveX: number;
    moveY: number;
    startX: number;
    startY: number;
}

const refreshRate = 16;
let gameTime = 0;
let gameRunning = false;
const bgColor = '#000000';
const canvasHeight = 500;
const canvasWidth = 500;

let mouseX = 0;
let mouseY = 0;

const player: Player = {
    color: '#ff0000',
    width: 15,
    height: 15,
    x: canvasWidth / 2 - 7,
    y: canvasHeight / 2 - 7,
    dragging: false
};

const enemies: Enemy[] = generateEnemies(6);

function generateEnemies(amount: number): Enemy[] {
    const enemies = [];
    for (var i = 0; i < amount; i++) {
        const size = getRandomInt(5, 20);
        const posX = getRandomInt(0, canvasWidth - size);
        const posY = getRandomInt(0, canvasHeight - size);
        const speedX = getRandomInt(-5, 5);
        const speedY = getRandomInt(-5, 5);
        const enemy = {
            color: '#596095',
            width: size,
            height: size,
            x: posX,
            y: posY,
            moveX: speedX == 0 ? 1 : speedX,
            moveY: speedY == 0 ? -1 : speedY,
            startX: posX,
            startY: posY
        };
        enemies.push(enemy);
    }

    return enemies;
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function drawGameObject(
    obj: GameObject,
    ctx: CanvasRenderingContext2D,
    oldX: number,
    oldY: number
): void {
    ctx.fillStyle = bgColor;
    ctx.fillRect(oldX, oldY, obj.width, obj.height);
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function mouseOnGameObject(mouseX: number, mouseY: number, obj: GameObject): boolean {
    return (
        mouseX >= obj.x - 10 &&
        mouseX <= obj.x + obj.width * 1.5 &&
        mouseY >= obj.y - 10 &&
        mouseY <= obj.y + obj.height * 1.5
    );
}

/**
 * Check that item is not against left or right canvas border
 * @param x
 * @param obj
 * @returns
 */
function canMoveXAxis(x: number, obj: GameObject): boolean {
    return x >= 0 && x <= canvasWidth - obj.width;
}

/**
 * Check that item is not against top or bottom canvas border
 * @param y
 * @param obj
 * @returns
 */
function canMoveYAxis(y: number, obj: GameObject): boolean {
    return y >= 0 && y <= canvasHeight - obj.height;
}

function gameObjectsColliding(one: GameObject, two: GameObject) {
    return (
        one.x + one.width > two.x &&
        one.x < two.x + two.width &&
        one.y + one.height > two.y &&
        one.y < two.y + two.height
    );
}

/**
 * Set enemy enemy position according to movement offset. Reverse movement if at the wall
 * @param enemy
 */
function moveEnemy(enemy: Enemy) {
    if (enemy.x >= canvasWidth - enemy.width) {
        enemy.moveX = -1 * Math.abs(enemy.moveX);
    } else if (enemy.x <= 0) {
        enemy.moveX = 1 * Math.abs(enemy.moveX);
    }
    if (enemy.y >= canvasHeight - enemy.height) {
        enemy.moveY = -1 * Math.abs(enemy.moveX);
    } else if (enemy.y <= 0) {
        enemy.moveY = 1 * Math.abs(enemy.moveX);
    }
    enemy.x = enemy.x + enemy.moveX;
    enemy.y = enemy.y + enemy.moveY;
}

function start(canvas: HTMLCanvasElement) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //initial draw of player
    drawGameObject(player, ctx, player.x, player.y);
    onmousedown = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        if (mouseOnGameObject(mouseX, mouseY, player)) {
            if (!gameRunning) gameTime = 0;
            gameRunning = true;
            //prevent text selection while moving player
            player.dragging = true;
            if (event.stopPropagation) event.stopPropagation();
            if (event.preventDefault) event.preventDefault();
            event.cancelBubble = true;
            return false;
        }
    };
    onmouseup = () => {
        player.dragging = false;
    };
    onmousemove = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
        const oldX = player.x;
        const oldY = player.y;
        if (player.dragging && gameRunning) {
            if (canMoveXAxis(mouseX, player)) player.x = mouseX;
            if (canMoveYAxis(mouseY, player)) player.y = mouseY;
            drawGameObject(player, ctx, oldX, oldY);
        }
    };
    const loop = setInterval(() => {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        enemies.forEach((enemy) => {
            const oldX = enemy.x;
            const oldY = enemy.y;
            if (gameRunning) {
                moveEnemy(enemy);
            }
            drawGameObject(enemy, ctx, oldX, oldY);
            if (gameObjectsColliding(enemy, player)) {
                gameRunning = false;
                player.dragging = false;

                let x = player.x;
                let y = player.y;
                //reset position
                player.x = canvasWidth / 2;
                player.y = canvasWidth / 2;
                drawGameObject(player, ctx, x, y);
                enemies.forEach((enemy) => {
                    x = enemy.x;
                    y = enemy.y;
                    enemy.x = enemy.startX;
                    enemy.y = enemy.startY;
                    drawGameObject(enemy, ctx, x, y);
                });
                return;
            }
        });
        drawGameObject(player, ctx, player.x, player.y);

        ctx.fillStyle = '#fff';
        ctx.fillRect(1, 1, 50, 20);
        ctx.strokeStyle = 'blue';
        ctx.font = '20px Arial';
        ctx.fillStyle = 'blue';
        ctx.fillText(Math.floor(gameTime / 1500).toString(), 5, 20);
        if (gameRunning) {
            gameTime += refreshRate;
        }
    }, refreshRate);
}

export default {start};
