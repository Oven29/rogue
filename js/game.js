import { BaseTile, EnemyTile, HeroTile } from "./tiles.js";
import { generateMap, getRandomInt } from "./map.js";
import cst from "./constants.js";

const RIGTH = [1, 0];
const LEFT = [-1, 0];
const UP = [0, -1];
const DOWN = [0, 1];

export class Game {
    drawMap() {
        const { map, hero, enemies } = generateMap();
        this.map = map;
        this.enemies = enemies.map(({ x, y }) => (
            new EnemyTile().draw(x, y)
        ));
        this.hero = new HeroTile().draw(hero.x, hero.y);
        this.items = [];

        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                const tile = this.map[i][j];
                new BaseTile(tile.type).draw(j, i);
                if ([cst.TILE_POTION, cst.TILE_SWORD].includes(tile.object)) {
                    this.items.push(new BaseTile(tile.object).draw(j, i));
                }
            }
        }
    }

    checkMove(x, y) {
        return this.map[y][x].type === cst.TILE_FLOOR &&
            !this.enemies.some(e => e.x === x && e.y === y && e.hp > 0) &&
            !(this.hero.x === x && this.hero.y === y);
    }

    isNear(x1, y1, x2, y2) {
        return (Math.abs(x1 - x2) <= 1 && y1 === y2) || (Math.abs(y1 - y2) <= 1 && x1 === x2);
    }

    addMovementToEnemies() {
        setInterval(() => {
            for (const enemy of this.enemies) {
                if (enemy.hp <= 0) continue;

                if (this.isNear(enemy.x, enemy.y, this.hero.x, this.hero.y)) {
                    this.hero.takeDamage(cst.ENEMY_ATACK);
                };

                const moves = [];
                moves.push([0, 0]);
                if (this.checkMove(enemy.x + RIGTH[0], enemy.y + RIGTH[1])) moves.push(RIGTH);
                if (this.checkMove(enemy.x + LEFT[0], enemy.y + LEFT[1])) moves.push(LEFT);
                if (this.checkMove(enemy.x + UP[0], enemy.y + UP[1])) moves.push(UP);
                if (this.checkMove(enemy.x + DOWN[0], enemy.y + DOWN[1])) moves.push(DOWN);
                const move = moves[getRandomInt(0, moves.length - 1)];
                enemy.move(move);
            }
        }, cst.ENEMY_INTERVAL);
    }

    addKeyboardEvents() {
        $(document).on('keydown', (e) => {
            if (e.key === 'w' && this.checkMove(this.hero.x + UP[0], this.hero.y + UP[1])) {
                this.hero.move(UP);
            } else if (e.key === 'a' && this.checkMove(this.hero.x + LEFT[0], this.hero.y + LEFT[1])) {
                this.hero.move(LEFT);
            } else if (e.key === 's' && this.checkMove(this.hero.x + DOWN[0], this.hero.y + DOWN[1])) {
                this.hero.move(DOWN);
            } else if (e.key === 'd' && this.checkMove(this.hero.x + RIGTH[0], this.hero.y + RIGTH[1])) {
                this.hero.move(RIGTH);
            } else if (e.key === ' ') {
                this.enemies.forEach(enemy => {
                    if (this.isNear(enemy.x, enemy.y, this.hero.x, this.hero.y)) {
                        enemy.takeDamage(this.hero.damage);
                    }
                })
            }

            const item = this.items.find(i => i.x === this.hero.x && i.y === this.hero.y);
            if (item) {
                this.items.splice(this.items.indexOf(item), 1);
                console.log('Getting', item.className);
                if (item.className === cst.TILE_SWORD) {
                    this.hero.setDamage(this.hero.damage + cst.SWORD_BONUS);
                } else if (item.className === cst.TILE_POTION) {
                    this.hero.setHP(Math.min(this.hero.hp + cst.POTION_BONUS, cst.HERO_HP));
                }
                item.remove();
            }
        });

    }

    init() {
        console.log('Initiing game...');
        $('.field').empty();

        this.drawMap();
        this.addMovementToEnemies();
        this.addKeyboardEvents();
    }
}
