import { BaseTile, EnemyTile, HeroTile } from "./tiles.js";
import { generateMap } from "./map.js";

export class Game {
    init() {
        console.log('Initiing game...');
        $('.field').empty();

        const { map, hero, enemies } = generateMap();
        this.map = map;
        this.enemies = enemies.map(({ x, y }) => (
            new EnemyTile().draw(x, y)
        ));
        this.hero = new HeroTile().draw(hero);

        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                const tile = this.map[i][j];
                new BaseTile(tile.type).draw(j, i);
                if (tile.object) {
                    new BaseTile(tile.object).draw(j, i);
                }
            }
        }
    }
}
