const game = new Core("view", 640, 640);
game.start();

const player = new Sprite(40, 40, 32, 32, false, true);

function handleInput(e) {
  console.log("Input handled");
  if (e.key === "ArrowRight") player.setVelocity(5, 0);
  if (e.key === "ArrowLeft") player.setVelocity(-5, 0);
  if (e.key === "ArrowUp") player.setVelocity(0, -5);
  if (e.key === "ArrowDown") player.setVelocity(0, 5);
}

game.addSprite(player);

// setInterval(handleInput, 1000 / 30);

document.addEventListener("keydown", handleInput);
