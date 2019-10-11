class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  draw(ctx) {}
  update() {
    console.log("update from GameObject");
  }
}
class Circle extends GameObject {
  constructor(x, y, radius, color) {
    super(x, y);

    this.radius = radius;
    this.color = color;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {}
}

class Core {
  constructor(id, width, height) {
    const canvas = document.getElementById(id);
    canvas.width = width;
    canvas.height = height;

    this.ctx = canvas.getContext("2d");
    this.width = width;
    this.height = height;

    this.objectsToDraw = [];
    this.objectsToPhysicUpdate = [];

    this.frameCounter = 0;
    this.timer = Date.now();
    this.timerId = null;
    this.fps = 0;
  }

  start() {
    // const self = this;
    this.timerId = setInterval(() => {
      if (Date.now() - self.timer > 1000) {
        this.fps = self.frameCounter;
        this.timer = Date.now();
        this.frameCounter = 0;
      }
      this.update();
      this.frameCounter++;
    }, 1000 / 60); // 60 fps
  }
  stop() {
    clearInterval(this.timerId);
    this.timerId = null;
  }

  update() {
    this.physicsUpdate();
    this.draw();

    this.ctx.font = "32px sans-serif";
    this.ctx.fillStyle = "#333";
    this.ctx.fillText(this.fps, 10, 30);
  }
  physicsUpdate() {
    this.objectsToPhysicUpdate.forEach(el => el.update());
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
  addObject(gameObj, zIndex = 0) {
    this.addSprite(gameObj, zIndex);
    this.objectsToPhysicUpdate.push(gameObj);
  }

  // TODO: rewrite on correct Array methods
  removeObject(gameObj) {
    // console.log(gameObj);
    // this.stop();
    // let id = this.objectsToPhysicUpdate.indexOf(gameObj);
    // console.log("ID for deletion " + id);
    // this.objectsToPhysicUpdate.splice(id, 0);

    this.objectsToPhysicUpdate = this.objectsToPhysicUpdate.filter(
      el => el !== gameObj
    );

    this.objectsToDraw = this.objectsToDraw.filter(el => el.object !== gameObj);

    // const _obj = this.objectsToDraw.filter(el => el.object === gameObj);
    // id = this.objectsToDraw.indexOf(_obj);
    // this.objectsToDraw, splice(id, 0);
  }
}
