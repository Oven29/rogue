import cst from "./constants.js";

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
    constructor(className, hp) {
        super(className);
        this.hp = hp;
        this.$hp = $('<div class="health" style="width: 100%"></div>');
    }

    draw(x, y) {
        this.$tile.append(this.$hp);
        super.draw(x, y);
        return this;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
        this.$tile.attr('style', `left: calc(${this.x} * var(--tile-width)); top: calc(${this.y} * var(--tile-height));`);
    }

    move(dir) {
        this.moveTo(this.x + dir[0], this.y + dir[1]);
    }

    setHP(hp) {
        this.hp = hp;
        this.$hp.css('width', `${this.hp / cst.HERO_HP * 100}%`);
    }

    takeDamage(damage) {
        this.setHP(this.hp - damage);
        if (this.hp <= 0) {
            this.remove();
            return true;
        }
        this.$tile.addClass('hit');
        setTimeout(() => this.$tile.removeClass('hit'), 100);
        return false;
    }
}

export class HeroTile extends UnitTile {
    constructor() {
        super(cst.TILE_HERO, cst.HERO_HP);
        this.damage = cst.HERO_ATACK;
    }

    setDamage(damage) {
        this.damage = damage;
    }
}

export class EnemyTile extends UnitTile {
    constructor() {
        super(cst.TILE_ENEMY, cst.ENEMY_HP);
    }
}
