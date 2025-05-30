import cst from './constants.js';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function placeRandomObject(map, objectType) {
    while (true) {
        const x = getRandomInt(0, cst.MAP_WIDTH - 1);
        const y = getRandomInt(0, cst.MAP_HEIGHT - 1);
        const tile = map[y][x];
        if (tile.type === cst.TILE_FLOOR && !tile.object) {
            tile.object = objectType;
            return { x, y };
        }
    }
}

function checkAllFloorReachable(map, floorType = cst.TILE_FLOOR) {
    const visited = Array.from({ length: cst.MAP_HEIGHT }, () =>
        Array.from({ length: cst.MAP_WIDTH }, () => false)
    );

    let found = false;
    let startX = 0;
    let startY = 0;

    outer: for (let y = 0; y < cst.MAP_HEIGHT; y++) {
        for (let x = 0; x < cst.MAP_WIDTH; x++) {
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
                nx < cst.MAP_WIDTH && ny < cst.MAP_HEIGHT &&
                !visited[ny][nx] &&
                map[ny][nx].type === floorType
            ) {
                visited[ny][nx] = true;
                queue.push([nx, ny]);
            }
        }
    }

    for (let y = 0; y < cst.MAP_HEIGHT; y++) {
        for (let x = 0; x < cst.MAP_WIDTH; x++) {
            if (map[y][x].type === floorType && !visited[y][x]) {
                return false; // Есть недостижимая клетка
            }
        }
    }

    return true;
}

export function generateMap() {
    console.log('Generating map...');

    const map = Array.from({ length: cst.MAP_HEIGHT }, () =>
        Array.from({ length: cst.MAP_WIDTH }, () => ({ type: cst.TILE_WALL, object: null }))
    );

    const isInside = (x, y) => x >= 0 && y >= 0 && x < cst.MAP_WIDTH && y < cst.MAP_HEIGHT;

    // --- Создание комнат ---
    const rooms = [];
    const roomCount = getRandomInt(5, 10);

    for (let i = 0; i < roomCount; i++) {
        const w = getRandomInt(3, 8);
        const h = getRandomInt(3, 8);
        const x = getRandomInt(1, cst.MAP_WIDTH - w - 1);
        const y = getRandomInt(1, cst.MAP_HEIGHT - h - 1);

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
                map[y + dy][x + dx].type = cst.TILE_FLOOR;
            }
        }
    }

    // --- Создание коридоров ---
    const horizontalCount = getRandomInt(3, 5);
    const verticalCount = getRandomInt(3, 5);

    for (let i = 0; i < horizontalCount; i++) {
        const y = getRandomInt(1, cst.MAP_HEIGHT - 2);
        const x1 = getRandomInt(1, cst.MAP_WIDTH / 2);
        const x2 = getRandomInt(cst.MAP_WIDTH / 2, cst.MAP_WIDTH - 2);
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
            map[y][x].type = cst.TILE_FLOOR;
        }
    }

    for (let i = 0; i < verticalCount; i++) {
        const x = getRandomInt(1, cst.MAP_WIDTH - 2);
        const y1 = getRandomInt(1, cst.MAP_HEIGHT / 2);
        const y2 = getRandomInt(cst.MAP_HEIGHT / 2, cst.MAP_HEIGHT - 2);
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
            map[y][x].type = cst.TILE_FLOOR;
        }
    }

    // --- Проверка доступности всех клеток ---
    if (!checkAllFloorReachable(map, cst.TILE_FLOOR)) {
        return generateMap(cst.MAP_WIDTH, cst.MAP_HEIGHT); // повторить генерацию
    }

    // --- Размещение предметов ---
    for (let i = 0; i < 2; i++) {
        placeRandomObject(map, cst.TILE_SWORD);
    }
    for (let i = 0; i < 10; i++) {
        placeRandomObject(map, cst.TILE_POTION);
    }

    // --- Размещение героя ---
    const hero = placeRandomObject(map, cst.TILE_HERO);

    // --- Размещение врагов ---
    const enemies = [];
    for (let i = 0; i < 10; i++) {
        enemies.push(placeRandomObject(map, cst.TILE_ENEMY));
    }

    return { map, hero, enemies };
}
