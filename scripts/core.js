class GameObject {
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
    this.vx = vx;
    this.vy = vy;
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

let frames = 0;
let timer = Date.now();

class Core {
  constructor(id, width, height) {
    const canvas = document.getElementById(id);
    canvas.width = width;
    canvas.height = height;

    this.ctx = canvas.getContext("2d");
    this.width = width;
    this.height = height;

    this.objectsToDraw = [];

    this.timerId = null;
  }

  start() {
    const self = this;
    this.timerId = setInterval(function() {
      if (Date.now() - timer > 1000) {
        console.log(frames);
        timer = Date.now();
        frames = 0;
      }
      self.update();
      frames++;
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
    //   this.elementsToPhysic.forEach(el => this.calculatePhysic());
  }
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.objectsToDraw.forEach(el => el.object.draw(this.ctx));
  }

  addSprite(gameObj, zIndex = 0) {
    const newObj = { object: gameObj, zIndex };

    for (let i = 0; i < this.objectsToDraw.length; i++) {
      if (zIndex < this.objectsToDraw[i].zIndex) {
        this.objectsToDraw.splice(i, 0, newObj);
        return;
      }
    }

    this.objectsToDraw.push(newObj);
  }
  addObject() {}
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
