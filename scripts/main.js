let bullets = [];
let _CORE = null;
let _SCORE = 0;

const WIDTH =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;
const HEIGHT =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

class Mouse {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.isShootingBtnDown = false;
    this.shootingBtnIndex = 0; // shoot at left btn click

    document.onmousemove = e => this.updatePosition(e.clientX, e.clientY);
    document.onmousedown = e => this.updateClick(e, true);
    document.onmouseup = e => this.updateClick(e, false);
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
  }

  updateClick(e, isDown) {
    if (e.button === this.shootingBtnIndex) {
      this.isShootingBtnDown = isDown;
    }
  }
}

class Player extends Circle {
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
      if (e.key === "w") this.direction.v = "top";
      if (e.key === "a") this.direction.h = "left";
      if (e.key === "s") this.direction.v = "bottom";
      if (e.key === "d") this.direction.h = "right";
    });
    document.addEventListener("keyup", e => {
      if (e.key === "a" || e.key === "d") this.direction.h = "";
      if (e.key === "w" || e.key === "s") this.direction.v = "";
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

class Bullet extends Circle {
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

class Enemy extends Circle {
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

class Game {
  constructor() {
    _CORE = new Core("view", WIDTH, HEIGHT);

    this._cooldawnToSpawnEnemy = 1; // spawn enemy every second
    this.lastSpawnedEnemyTimer = 0;

    this.player = null;
    this.enemies = [];

    this.createPlayer();

    _CORE.addObject(this, 100);
    _CORE.start();
  }

  createPlayer() {
    this.player = new Player(WIDTH / 2, HEIGHT / 2, 30, "#cccccc");
    _CORE.addObject(this.player, 10);
  }
  createEnemy() {
    const enemyColor = "#e53935";
    const enemyRadius = 50;

    const side = Math.floor(randomInRange(0, 4));
    const x = randomInRange(0, WIDTH);
    const y = randomInRange(0, HEIGHT);

    const enemyCoords = { x, y };

    if (side === 0) enemyCoords.y = -enemyRadius;
    if (side === 1) enemyCoords.x = WIDTH + enemyRadius;
    if (side === 2) enemyCoords.y = HEIGHT + enemyRadius;
    if (side === 3) enemyCoords.x = -enemyRadius;

    const newEnemy = new Enemy(
      enemyCoords.x,
      enemyCoords.y,
      enemyRadius,
      enemyColor,
      this.player
    );

    this.enemies.push(newEnemy);
    _CORE.addObject(newEnemy);
  }

  draw(ctx) {
    const borderColor = "#333333";
    const fillColor = "#66BB6A";

    // drawing health bar and points
    const length = 300;
    const fat = length / 8;
    ctx.save();
    ctx.translate(WIDTH - length - 50, 30);
    //ctx.rotate(this.angle);
    ctx.lineWidth = 3;
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = borderColor;

    // filling
    ctx.fillRect(0, 0, (length * this.player.health) / 100, fat);

    // border
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(length, 0);
    ctx.lineTo(length, fat);
    ctx.lineTo(0, fat);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.stroke();

    ctx.font = "32px sans-serif";
    ctx.fillStyle = "#333";
    ctx.fillText("Score: " + _SCORE, 10, 30);

    ctx.restore();
  }

  update() {
    const now = Date.now();
    if (now - this.lastSpawnedEnemyTimer > this._cooldawnToSpawnEnemy * 1000) {
      this.createEnemy();
      this.lastSpawnedEnemyTimer = now;
      this._cooldawnToSpawnEnemy -= 5 / 1000;
    }

    if (this.player.health === 0) {
      console.log("You died...");
      console.log("You score: " + _SCORE);
      _CORE.stop();
    }
    // console.log("update game obj");
  }
}

const game = new Game();

function calculateDistance(aX, aY, bX, bY) {
  const cX = bX - aX;
  const cY = bY - aY;
  return Math.sqrt(cX * cX + cY * cY);
}
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}
/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */
function rotate(vector, angle) {
  const rotatedVector = {
    x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
    y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
  };

  return rotatedVector;
}
/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */
function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}
