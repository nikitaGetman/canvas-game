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

    this.frames = 0;
    this.timer = Date.now();
    this.timerId = null;

    this.fpsIndicator = document.getElementById("fps") || {};
  }

  start() {
    const self = this;
    this.timerId = setInterval(function() {
      if (Date.now() - self.timer > 1000) {
        self.fpsIndicator.innerText = self.frames;
        self.timer = Date.now();
        self.frames = 0;
      }
      self.update();
      self.frames++;
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
}
