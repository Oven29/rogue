export class BaseTile {
    constructor(className) {
        this.className = className;
        this.$tile = $(`<div class="tile ${this.className !== 'tile' ? this.className : ''}"></div>`);
    }

    draw(x, y) {
        this.x = x;
        this.y = y;
        this.$tile.attr('style', `left: calc(${this.x} * var(--tile-width)); top: calc(${this.y} * var(--tile-height));`);
        $('.field').append(this.$tile);
        return this;
    }

    remove() {
        this.$tile.remove();
    }
}

export class UnitTile extends BaseTile {
    draw(x, y) {
        super.draw(x, y);
    }
}

export class HeroTile extends UnitTile {
    constructor() {
        super('tileH');
    }
}

export class EnemyTile extends UnitTile {
    constructor() {
        super('tileE');
    }
}
