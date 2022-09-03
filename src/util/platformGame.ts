interface Coordinates {
    x: number;
    y: number;
}

interface GameObject extends Coordinates {
    color: string;
    width: number;
    height: number;
}

interface Jump {
    landingX: number;
    minY: number;
    directionUp: boolean;
}

interface Player extends GameObject {
    jump: Jump;
    dead: boolean;
    pieces: GameObject[];
}

interface Level {
    floors: GameObject[];
    end: GameObject;
}

const colors = {
    bg: '#000',
    ground: '#878282',
    end: '#f1d826',
    statusBg: '#fff',
    player: 'red'
};

const maxJumpHeight = 30;
let canvas = null;
let canvasWidth = 500;
const canvasHeight = 500;
let statusHeight = 25;
let statusPadding = 5;

let activeLevel = 0;

const inputs = {
    up: false,
    down: false,
    left: false,
    right: false
};

const player: Player = {
    color: colors.player,
    height: 10,
    width: 10,
    x: 0,
    y: 0,
    jump: null,
    dead: false,
    pieces: null
};

let gameLoop = null;

let levels: Level[] = [];

function generateLevels(count: number): Level[] {
    const levels = [];
    const floorHeight = 5;
    const endWidth = 5;
    const endHeight = 50;

    for (var l = 0; l < count; l++) {
        const floorCount = getRandomInt(3, 10);
        let usedWidth = 0;
        let currentY = canvasHeight / 2;
        const level = {floors: [], end: null};
        for (var i = 0; i < floorCount; i++) {
            const width = getRandomInt(50, (canvasWidth - usedWidth) / 4);
            const gap = i == 0 ? 0 : getRandomInt(maxJumpHeight, maxJumpHeight * 2 + player.width);
            if (width + gap + usedWidth >= canvasWidth) {
                i = floorCount + 1;
            } else {
                const x = i == 0 ? 0 : level.floors[i - 1].x + level.floors[i - 1].width + gap;
                const floor: GameObject = {
                    x,
                    y: currentY,
                    height: floorHeight,
                    width: width,
                    color: colors.ground
                };
                level.floors.push(floor);
                usedWidth += width + gap;
            }
        }

        const last = level.floors[level.floors.length - 1];
        level.end = {
            x: last.x + last.width - endWidth,
            y: last.y - endHeight + floorHeight,
            color: colors.end,
            width: endWidth,
            height: endHeight
        };

        levels.push(level);
    }

    return levels;
}

function drawLevel(level: number, ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const map = levels[level];
    map.floors.forEach((elem) => {
        ctx.fillStyle = elem.color;
        ctx.fillRect(elem.x, elem.y, elem.width, elem.height);
    });
    ctx.fillStyle = map.end.color;
    ctx.fillRect(map.end.x, map.end.y, map.end.width, map.end.height);
}

function initLevel(level: number, ctx: CanvasRenderingContext2D) {
    const map = levels[level];
    player.x = map.floors[0].x + player.width;
    player.y = map.floors[0].y - player.height - 20;
    player.jump = null;
    player.dead = false;
    player.pieces = null;
}

function drawGameObject(obj: GameObject, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function drawStatusBar(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = colors.statusBg;
    ctx.fillRect(statusPadding, statusPadding, ctx.canvas.width - statusPadding * 2, statusHeight);
    ctx.font = '15px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(
        'LEVEL ' + (activeLevel + 1) + ' / ' + levels.length,
        statusPadding + 10,
        statusPadding + 18
    );
}

function refreshCanvas(ctx: CanvasRenderingContext2D) {
    drawLevel(activeLevel, ctx);
    drawStatusBar(ctx);
    if (!player.dead) {
        drawGameObject(player, ctx);
    }
    if (player.pieces) {
        player.pieces.forEach((p) => {
            drawGameObject(p, ctx);
        });
    }
}

function gameObjectsColliding(one: GameObject, two: GameObject) {
    return (
        one.x + one.width > two.x &&
        one.x < two.x + two.width &&
        one.y + one.height > two.y &&
        one.y < two.y + two.height
    );
}

function canMoveXAxis(x: number, obj: GameObject): boolean {
    return x >= 0 && x <= canvasWidth - obj.width;
}

function canMoveYAxis(y: number, obj: GameObject): boolean {
    return y >= statusHeight + statusPadding + obj.height / 2 && y <= canvasHeight - obj.height;
}

function stop() {
    if (gameLoop) {
        clearInterval(gameLoop);
    }
}

function generateDeathEffect(obj: GameObject): GameObject[] {
    const count = getRandomInt(10, 15);
    const pieces = [];
    for (var i = 0; i < count; i++) {
        pieces.push({
            x: obj.x + getRandomInt(obj.width * -1, obj.width),
            y: obj.y + getRandomInt(obj.height * -1, obj.height),
            color: obj.color,
            height: obj.height / getRandomInt(3, 5),
            width: obj.width / getRandomInt(3, 5)
        });
    }
    return pieces;
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

onresize = () => {
    stop();
    start(canvas);
};

function start(c: HTMLCanvasElement) {
    canvas = c;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    canvasWidth = canvas.parentElement.getBoundingClientRect().width;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    levels = generateLevels(20);
    initLevel(activeLevel, ctx);
    onkeydown = (ev: KeyboardEvent) => {
        switch (ev.key) {
            case 'Enter':
                initLevel(activeLevel, ctx);
                break;
            case 'ArrowUp':
                if (!inputs.up && !player.jump) {
                    const maxDist = maxJumpHeight * 2;
                    let dist = 0;
                    if (inputs.right) {
                        dist = maxDist;
                    }
                    if (inputs.left) {
                        dist = -maxDist;
                    }
                    player.jump = {
                        landingX: player.x + dist,
                        minY: player.y - maxJumpHeight,
                        directionUp: true
                    };
                }
                inputs.up = true;
                break;
            case 'ArrowDown':
                if (!inputs.down) {
                    player.height = player.height / 2;
                    player.width = player.width * 1.2;
                }
                inputs.down = true;
                break;
            case 'ArrowLeft':
                inputs.left = true;
                break;
            case 'ArrowRight':
                inputs.right = true;
                break;
        }
    };
    onkeyup = (ev: KeyboardEvent) => {
        switch (ev.key) {
            case 'ArrowUp':
                inputs.up = false;
                break;
            case 'ArrowDown':
                if (inputs.down) {
                    player.height = player.height * 2;
                    player.width = player.width / 1.2;
                    player.y = player.y - player.height / 2;
                }
                inputs.down = false;
                break;
            case 'ArrowLeft':
                inputs.left = false;
                break;
            case 'ArrowRight':
                inputs.right = false;
                break;
        }
    };
    gameLoop = setInterval(() => {
        let floorContact = false;
        let maxFloorY = 0;
        levels[activeLevel].floors.forEach((f) => {
            if (gameObjectsColliding(player, f)) floorContact = true;
            if (f.y > maxFloorY) maxFloorY = f.y;
        });

        if (player.jump) {
            if (player.x < player.jump.landingX && canMoveXAxis(player.x + 1, player)) player.x++;
            else if (player.x > player.jump.landingX && canMoveXAxis(player.x - 1, player))
                player.x--;
        }
        if (player.jump && player.jump.directionUp) {
            if (player.jump.minY < player.y && canMoveYAxis(player.y - 1, player)) player.y--;
            else if (
                player.jump.minY >= player.y ||
                !canMoveYAxis(player.y - 1, player) ||
                floorContact
            )
                player.jump.directionUp = false;
        } else {
            if (!floorContact) player.y++;
            else if (!inputs.down) {
                player.jump = null;
                //cant move while crouched
                if (inputs.right && canMoveXAxis(player.x + 1, player)) {
                    player.x++;
                }
                if (inputs.left && canMoveXAxis(player.x - 1, player)) {
                    player.x--;
                }
            }
        }
        //check if player is lower than lowest floor of level, if yes, set dead and generate death particle effect
        if (player.y >= maxFloorY + player.height * 2 && player.y < maxFloorY + player.height * 8) {
            player.dead = true;
            if (!player.pieces) {
                player.pieces = generateDeathEffect(player);
            } else {
                player.pieces.forEach((p) => {
                    p.y++;
                    if (p.x > player.x) p.x = p.x + getRandomInt(0, 1);
                    else p.x = p.x - getRandomInt(0, 1);
                });
            }
        } else if (player.dead) {
            activeLevel = 0;
            initLevel(activeLevel, ctx);
        }
        //check if player has reached end of current level
        else if (gameObjectsColliding(player, levels[activeLevel].end)) {
            if (activeLevel == levels.length - 1) {
                activeLevel = 0;
            } else {
                activeLevel++;
            }
            initLevel(activeLevel, ctx);
        }
        refreshCanvas(ctx);
    }, 16);
}

export default {start, stop};
