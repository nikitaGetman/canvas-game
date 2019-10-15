// TODO: refactor updateClick

export class Mouse {
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
