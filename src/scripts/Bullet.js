import { Circle } from "./core";

export class Bullet extends Circle {
  constructor(x, y, radius, color, velocity, damage = 1) {
    super(x, y, radius, color);

    this.velocity = velocity;

    this.damage = damage;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
  }
  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // if too far from center then delete object
    const dst = calculateDistance(this.x, this.y, WIDTH / 2, HEIGHT / 2);
    if (dst > (WIDTH + HEIGHT) * 2) {
      this.destroy();
    }
  }

  destroy() {
    // console.log("REMOVING bullet");

    bullets = bullets.filter(b => b !== this);
    _CORE.removeObject(this);
  }
}
