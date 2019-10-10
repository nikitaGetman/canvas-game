const width = 640;
const height = 640;
const game = new Core("view", width, height);

const player = new GameObject(40, 40, 32, 32, false, true);

function handleInput(e) {
  if (e.key === "ArrowRight") player.setVelocity(5, 0);
  if (e.key === "ArrowLeft") player.setVelocity(-5, 0);
  if (e.key === "ArrowUp") player.setVelocity(0, -5);
  if (e.key === "ArrowDown") player.setVelocity(0, 5);
}
document.addEventListener("keydown", handleInput);

const background = new GameObject(
  0,
  0,
  width,
  height,
  false,
  false,
  (self, ctx) => {
    const offset = 8;

    roundedFilledRect(
      ctx,
      offset,
      offset,
      self.width - offset * 2,
      self.height - offset * 2,
      15,
      "#1A237E"
    );

    roundedRect(
      ctx,
      offset,
      offset,
      self.width - offset * 2,
      self.height - offset * 2,
      15,
      "#212121",
      offset
    );
  }
);

game.addSprite(background, 5);
game.addSprite(player, 5);

// setInterval(handleInput, 1000 / 30);

game.start();
