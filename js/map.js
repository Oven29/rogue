const TILE_WALL = "tileW";
const TILE_FLOOR = "tile";
const HEIGHT = 24;
const WIDTH = 40;


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function placeRandomObject(map, objectType) {
    while (true) {
        const x = getRandomInt(0, WIDTH - 1);
        const y = getRandomInt(0, HEIGHT - 1);
        const tile = map[y][x];
        if (tile.type === TILE_FLOOR && !tile.object) {
            tile.object = objectType;
            return { x, y };
        }
    }
}

function checkAllFloorReachable(map, floorType = TILE_FLOOR) {
    const visited = Array.from({ length: HEIGHT }, () =>
        Array.from({ length: WIDTH }, () => false)
    );

    let found = false;
    let startX = 0;
    let startY = 0;

    outer: for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            if (map[y][x].type === floorType) {
                startX = x;
                startY = y;
                found = true;
                break outer;
            }
        }
    }

    if (!found) return false;

    const queue = [[startX, startY]];
    visited[startY][startX] = true;

    const dirs = [
        [1, 0], [-1, 0],
        [0, 1], [0, -1],
    ];

    while (queue.length) {
        const [x, y] = queue.shift();
        for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (
                nx >= 0 && ny >= 0 &&
                nx < WIDTH && ny < HEIGHT &&
                !visited[ny][nx] &&
                map[ny][nx].type === floorType
            ) {
                visited[ny][nx] = true;
                queue.push([nx, ny]);
            }
        }
    }

    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            if (map[y][x].type === floorType && !visited[y][x]) {
                return false; // Есть недостижимая клетка
            }
        }
    }

    return true;
}

export function generateMap() {
    console.log('Generating map...');

    const map = Array.from({ length: HEIGHT }, () =>
        Array.from({ length: WIDTH }, () => ({ type: TILE_WALL, object: null }))
    );

    const isInside = (x, y) => x >= 0 && y >= 0 && x < WIDTH && y < HEIGHT;

    // --- Создание комнат ---
    const rooms = [];
    const roomCount = getRandomInt(5, 10);

    for (let i = 0; i < roomCount; i++) {
        const w = getRandomInt(3, 8);
        const h = getRandomInt(3, 8);
        const x = getRandomInt(1, WIDTH - w - 1);
        const y = getRandomInt(1, HEIGHT - h - 1);

        const overlaps = rooms.some(r =>
            x < r.x + r.w &&
            x + w > r.x &&
            y < r.y + r.h &&
            y + h > r.y
        );
        if (overlaps) continue;

        rooms.push({ x, y, w, h });

        for (let dy = 0; dy < h; dy++) {
            for (let dx = 0; dx < w; dx++) {
                map[y + dy][x + dx].type = TILE_FLOOR;
            }
        }
    }

    // --- Создание коридоров ---
    const horizontalCount = getRandomInt(3, 5);
    const verticalCount = getRandomInt(3, 5);

    for (let i = 0; i < horizontalCount; i++) {
        const y = getRandomInt(1, HEIGHT - 2);
        const x1 = getRandomInt(1, WIDTH / 2);
        const x2 = getRandomInt(WIDTH / 2, WIDTH - 2);
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
            map[y][x].type = TILE_FLOOR;
        }
    }

    for (let i = 0; i < verticalCount; i++) {
        const x = getRandomInt(1, WIDTH - 2);
        const y1 = getRandomInt(1, HEIGHT / 2);
        const y2 = getRandomInt(HEIGHT / 2, HEIGHT - 2);
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
            map[y][x].type = TILE_FLOOR;
        }
    }

    // --- Проверка доступности всех клеток ---
    if (!checkAllFloorReachable(map, TILE_FLOOR)) {
        return generateMap(WIDTH, HEIGHT); // повторить генерацию
    }

    // --- Размещение предметов ---
    for (let i = 0; i < 2; i++) {
        placeRandomObject(map, "tileSW");
    }
    for (let i = 0; i < 10; i++) {
        placeRandomObject(map, "tileHP");
    }

    // --- Размещение героя ---
    const hero = placeRandomObject(map, "tileP");

    // --- Размещение врагов ---
    const enemies = [];
    for (let i = 0; i < 10; i++) {
        enemies.push(placeRandomObject(map, "tileE"));
    }

    return { map, hero, enemies };
}
