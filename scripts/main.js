const width =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;
const height =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

const game = new Core("view", width, height);

const mousePosition = { x: -1000, y: -1000 };
const mouseRadius = 150;
document.onmousemove = function(e) {
  mousePosition.x = e.clientX;
  mousePosition.y = e.clientY;
};

class Circle extends GameObject {
  constructor(x, y, radius, color, mass) {
    super(x, y);

    this.radius = radius;
    this.color = color;
    this.opacity = 0;

    this.velocity = {
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 5
    };
    this.mass = mass;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    if (this.opacity > 0) {
      const color = hexToRgb(this.color);
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${this.opacity})`;
      // ctx.fillStyle = this.color;
      ctx.fill();
    }
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if (this.x <= this.radius || this.x >= width - this.radius)
      this.velocity.x = -this.velocity.x;
    if (this.y <= this.radius || this.y >= height - this.radius)
      this.velocity.y = -this.velocity.y;
    circles.forEach(circle => {
      if (circle !== this) {
        const dst = calculateDistance(this.x, this.y, circle.x, circle.y);
        if (dst <= this.radius + circle.radius) {
          resolveCollision(this, circle);
        }
      }
    });
    const dstToMouse = calculateDistance(
      this.x,
      this.y,
      mousePosition.x,
      mousePosition.y
    );
    if (dstToMouse < mouseRadius) {
      if (this.opacity < 1) this.opacity += 0.05;
    } else {
      if (this.opacity > 0) this.opacity -= 0.05;
      if (this.opacity < 0) this.opacity = 0;
    }
  }
}

const radius = 30;
let circles = [];
// generating new circles
for (let i = 0; i < 50; i++) {
  let x = randomInRange(radius + 10, width - radius - 10);
  let y = randomInRange(radius + 10, height - radius - 10);
  // checking for collisiion on creation
  for (let i = 0; i < circles.length; i++) {
    const dst = calculateDistance(x, y, circles[i].x, circles[i].y);
    if (dst < radius * 2) {
      x = randomInRange(radius + 10, width - radius - 10);
      y = randomInRange(radius + 10, height - radius - 10);

      i = -1;
    }
  }

  const newCircle = new Circle(x, y, radius, "#660066", 1);

  circles.push(newCircle);
  game.addObject(newCircle);
}

game.start();

function calculateDistance(aX, aY, bX, bY) {
  const cX = bX - aX;
  const cY = bY - aY;
  return Math.sqrt(cX * cX + cY * cY);
}
function randomInRange(min, max) {
  return Math.round(Math.random() * (max - min + 1)) + min;
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
function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
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
