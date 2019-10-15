import { Circle } from "./core";
import Mouse from "./Mouse";

export class Player extends Circle {
  constructor(x, y, radius, color) {
    super(x, y, radius, color);

    this.angle = 0;
    this.velocity = { x: 0, y: 0 };
    this.direction = { v: "", h: "" };

    this.health = 100;
    this.lastShootTime = 0;
    this.mouse = new Mouse();

    this._shootCooldown = 0.05; // shoot every 0.5s
    this._axeliration = 0.35;
    this._maxspeed = 7;
    this._damageCooldawn = 1;
    this.lastDamageTimer = 0;

    document.addEventListener("keydown", e => {
      if (e.key === "w" || e.key === "ц") this.direction.v = "top";
      if (e.key === "a" || e.key === "ф") this.direction.h = "left";
      if (e.key === "s" || e.key === "ы") this.direction.v = "bottom";
      if (e.key === "d" || e.key === "в") this.direction.h = "right";
    });
    document.addEventListener("keyup", e => {
      if (e.key === "a" || e.key === "d" || e.key === "ф" || e.key === "в")
        this.direction.h = "";
      if (e.key === "w" || e.key === "s" || e.key === "ц" || e.key === "ы")
        this.direction.v = "";
    });
  }

  draw(ctx) {
    const weaponColor = "#4FC3F7";
    const playerColor = "#4FC3F7";
    // drawing weapons
    const length = this.radius * 1.5;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.lineWidth = 1;
    ctx.fillStyle = weaponColor;
    // left hand
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(length, -this.radius);
    ctx.lineTo(length, -this.radius / 2);
    ctx.lineTo(0, -this.radius / 2);
    ctx.lineTo(0, -this.radius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // right hand
    ctx.beginPath();
    ctx.moveTo(0, this.radius);
    ctx.lineTo(length, this.radius);
    ctx.lineTo(length, this.radius / 2);
    ctx.lineTo(0, this.radius / 2);
    ctx.lineTo(0, this.radius);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // drawing circle hero
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = playerColor;
    ctx.fill();
    ctx.stroke();
  }
  update() {
    // handling input by Y axis
    if (this.direction.v === "top") {
      if (this.velocity.y > -this._maxspeed)
        this.velocity.y -= this._axeliration;
      if (this.velocity.y < -this._maxspeed) this.velocity.y = -this._maxspeed;
    } else if (this.direction.v === "bottom") {
      if (this.velocity.y < this._maxspeed)
        this.velocity.y += this._axeliration;
      if (this.velocity.y > this._maxspeed) this.velocity.y = this._maxspeed;
    } else {
      if (this.velocity.y !== 0) {
        if (Math.abs(this.velocity.y) > this._axeliration) {
          if (this.velocity.y > 0) this.velocity.y -= this._axeliration;
          else this.velocity.y += this._axeliration;
        } else {
          this.velocity.y = 0;
        }
      }
    }

    // handling input by X axis
    if (this.direction.h === "left") {
      if (this.velocity.x > -this._maxspeed)
        this.velocity.x -= this._axeliration;
      if (this.velocity.x < -this._maxspeed) this.velocity.x = -this._maxspeed;
    } else if (this.direction.h === "right") {
      if (this.velocity.x < this._maxspeed)
        this.velocity.x += this._axeliration;
      if (this.velocity.x > this._maxspeed) this.velocity.x = this._maxspeed;
    } else {
      if (this.velocity.x !== 0) {
        if (Math.abs(this.velocity.x) > this._axeliration) {
          if (this.velocity.x > 0) this.velocity.x -= this._axeliration;
          else this.velocity.x += this._axeliration;
        } else {
          this.velocity.x = 0;
        }
      }
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.x < this.radius) this.x = this.radius;
    if (this.x > WIDTH - this.radius) this.x = WIDTH - this.radius;
    if (this.y < this.radius) this.y = this.radius;
    if (this.y > HEIGHT - this.radius) this.y = HEIGHT - this.radius;

    this.angle = Math.atan2(this.mouse.y - this.y, this.mouse.x - this.x);

    const now = Date.now();
    if (
      this.mouse.isShootingBtnDown &&
      now - this.lastShootTime > this._shootCooldown * 1000
    ) {
      this.shoot();
      this.lastShootTime = now;
    }
  }
  shoot() {
    const bulletColor = "#29B6F6";
    const bulletRadius = 10;
    const bulletSpeed = 15;

    const dispersion = randomInRange(-12 / 2, 12 / 2) / (180 / Math.PI); // dispersion 15deg

    const direction = this.angle + dispersion;

    const vector = rotate({ x: bulletSpeed, y: 0 }, direction);

    const newBullet = new Bullet(
      this.x,
      this.y,
      bulletRadius,
      bulletColor,
      vector
    );

    bullets.push(newBullet);
    _CORE.addObject(newBullet);
  }

  getDamage(damage) {
    const now = Date.now();
    if (now - this.lastDamageTimer > this._damageCooldawn * 100) {
      this.health -= damage;
      if (this.health < 0) this.health = 0;

      this.lastDamageTimer = now;
    }
  }
}
