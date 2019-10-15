import { Circle } from "./core";

export class Enemy extends Circle {
  constructor(x, y, radius, color, player, damage = 10, health = 10) {
    super(x, y, radius, color);

    this.target = player;
    this._damage = damage;

    this.health = health;
    this._maxHealth = health;
    this._maxRadius = radius;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
  }
  update() {
    const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
    const speed = 2;

    const vector = rotate({ x: speed, y: 0 }, angle);

    this.x += vector.x;
    this.y += vector.y;

    const dst = calculateDistance(this.x, this.y, this.target.x, this.target.y);
    if (dst < this.radius + this.target.radius) {
      this.target.getDamage(this._damage);
    }

    bullets.forEach(b => {
      const dst = calculateDistance(b.x, b.y, this.x, this.y);
      if (dst < b.radius + this.radius) {
        this.getDamage(b.damage);
        b.destroy();
      }
    });
  }

  getDamage(damage) {
    this.health -= damage;
    this.radius = (this._maxRadius * this.health) / this._maxHealth;

    if (this.radius < this._maxRadius / 4) this.radius = this._maxRadius / 4;

    if (this.health <= 0) this.destroy();
  }

  destroy() {
    _SCORE++;
    _CORE.removeObject(this);
  }
}
