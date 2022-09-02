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

const refreshRate = 15;
let gameTime = 0;
let gameRunning = false;
const bgColor = '#000000';
const canvasHeight = 500;
var canvasWidth = 500;

let mouseX = 0;
let mouseY = 0;

const player: Player = {
    color: '#ff0000',
    width: 15,
    height: 15,
    x: 0,
    y: 0,
    dragging: false
};

let enemies: Enemy[] = [];

/**
 * Create enemies with randomly generated staring position, direction, size and speed
 * @param amount how many enemies should be created
 * @returns array of created enemis
 */
function generateEnemies(amount: number): Enemy[] {
    const enemies = [];
    for (var i = 0; i < amount; i++) {
        const size = getRandomInt(15, 20);
        const posX = getRandomInt(0, canvasWidth - size);
        const posY = getRandomInt(0, canvasHeight - size);
        const speedX = getRandomInt(-4, 4);
        const speedY = getRandomInt(-4, 4);
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

/**
 * Get random integer between given range
 * @param min
 * @param max
 * @returns
 */
function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Clear gameobjects previous location and draw new one to current coordinates
 * @param obj
 * @param ctx
 * @param oldX
 * @param oldY
 */
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

/**
 * Check if mouse coordinates are within gameobjects coordinates
 * @param mouseX
 * @param mouseY
 * @param obj
 * @returns
 */
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

/**
 * Check if two gameobjects share overlapping coordinates
 * @param one
 * @param two
 * @returns
 */
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

/**
 * Draw game time
 * @param ctx
 */
function drawTimer(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(1, 1, 50, 20);
    ctx.strokeStyle = 'blue';
    ctx.font = '20px Arial';
    ctx.fillStyle = 'blue';
    ctx.fillText(Math.floor(gameTime).toString(), 5, 20);
}

function drawBackground(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Initialize game state set player to starting position and generate new enemies
 * @param ctx
 */
function init(ctx: CanvasRenderingContext2D) {
    gameRunning = false;
    player.dragging = false;
    //initial draw of player
    player.x = canvasWidth / 2 - player.width;
    player.y = canvasHeight / 2 - player.height;
    drawGameObject(player, ctx, player.x, player.y);
    //create enemies
    enemies = generateEnemies(canvasWidth / 100);
}

/**
 * Generate random number and alter enemies acording to value
 */
function generateRandomEvent() {
    if (gameRunning && gameTime > 10) {
        const rnd = getRandomInt(0, 1000);
        //Add new enemy to the game
        if (rnd > 998) {
            enemies.push(generateEnemies(1)[0]);
        }
        if (rnd < 100) {
            const idx = getRandomInt(0, enemies.length - 1);
            const enemy = enemies[idx];
            if (rnd > 50) {
                //change enemy properties unexpectedly
                enemies[idx] = generateEnemies(1)[0];
                enemies[idx].height = enemy.height;
                enemies[idx].height = enemy.width;
                enemies[idx].x = enemy.x;
                enemies[idx].y = enemy.y;
            } else {
                //increase enemy speed
                if (enemy.moveX > 0) enemy.moveX++;
                else enemy.moveX--;
                if (enemy.moveY > 0) enemy.moveY++;
                else enemy.moveY--;
            }
        }
    }
}

/**
 * Run game clock
 */
setInterval(() => {
    if (gameRunning) {
        gameTime += 1;
    }
}, 1000);

/**
 * Start game, initialize game objects and start main loop and add eventhandlers
 * @param canvas
 */
function start(canvas: HTMLCanvasElement) {
    canvasWidth = canvas.parentElement.getBoundingClientRect().width;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    init(ctx);
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
    setInterval(() => {
        drawBackground(ctx);
        enemies.forEach((enemy) => {
            const oldX = enemy.x;
            const oldY = enemy.y;
            if (gameRunning) {
                moveEnemy(enemy);
            }
            drawGameObject(enemy, ctx, oldX, oldY);
            if (gameObjectsColliding(enemy, player)) {
                init(ctx);
                return;
            }
        });
        drawGameObject(player, ctx, player.x, player.y);
        drawTimer(ctx);
        generateRandomEvent();
    }, refreshRate);
}

export default {start};
