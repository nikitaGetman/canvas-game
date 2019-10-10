class Sprite {
  constructor(
    posX,
    posY,
    width,
    height,
    enableCollisions = false,
    enablePhysic = false,
    drFunc = null
  ) {
    this.posX = posX;
    this.posY = posY;

    this.width = width;
    this.height = height;

    this.isCollisionEnabled = enableCollisions;
    this.isPhysicEnabled = enablePhysic;
    this.vx = 0;
    this.vy = 0;

    this.customDrawFunction = drFunc;
  }

  setVelocity(vx, vy) {
    console.log("setted verlocity");
    console.log(vx);
    console.log(vy);
    this.vx = vx;
    this.vy = vy;
  }
  physic() {
    // console.log("moving from: " + this.posX + " - " + this.posY);
    // console.log("on: " + this.vx + " - " + this.vy);
    this.posX += this.vx;
    this.posY += this.vy;
  }
  draw(ctx) {
    if (this.customDrawFunction) {
      this.customDrawFunction(this, ctx);
    } else {
      roundedFilledRect(
        ctx,
        this.posX,
        this.posY,
        this.width,
        this.height,
        4,
        "red"
      );
    }
  }
  setDrawFunction(dr) {
    this.customDrawFunction = dr;
  }
}

class Core {
  constructor(id, width, height) {
    const canvas = document.getElementById(id);
    this.ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    this.width = width;
    this.height = height;

    this.elementsToDraw = [];
    this.elementsToPhysic = [];

    this.timerId = null;
  }

  start() {
    const self = this;
    this.timerId = setInterval(function() {
      self.update();
    }, 1000 / 30); // 30 fps
  }
  stop() {
    clearInterval(this.timerId);
    this.timerId = null;
  }

  update() {
    this.physicsUpdate();
    this.draw();
  }
  physicsUpdate() {
    this.elementsToPhysic.forEach(el => el.physic());
  }
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.drawBackground();
    this.drawObjects();
  }
  drawBackground() {
    const offset = 8;

    roundedFilledRect(
      this.ctx,
      offset,
      offset,
      this.width - offset * 2,
      this.height - offset * 2,
      15,
      "#1A237E"
    );

    roundedRect(
      this.ctx,
      offset,
      offset,
      this.width - offset * 2,
      this.height - offset * 2,
      15,
      "#212121",
      offset
    );
  }
  drawObjects() {
    this.elementsToDraw.forEach(el => el.draw(this.ctx));
  }
  addSprite(sprite) {
    this.elementsToDraw.push(sprite);
    if (sprite.isCollisionEnabled || sprite.isPhysicEnabled) {
      this.elementsToPhysic.push(sprite);
    }
  }
}

function roundedFilledRect(ctx, x, y, width, height, radius, color) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);

  ctx.fillStyle = color;
  ctx.fill();
}
function roundedRect(
  ctx,
  x,
  y,
  width,
  height,
  radius,
  color,
  lineFat,
  lineCap = "butt"
) {
  ctx.lineWidth = lineFat;
  ctx.lineCap = lineCap;

  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.strokeStyle = color;
  ctx.stroke();
}
function initWebGL(canvas) {
  gl = null;

  return gl;
}
