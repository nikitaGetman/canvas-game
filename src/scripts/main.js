import { Core } from './core'
import Player from './Player'
import Enemy from './Enemy'

let bullets = []
let _CORE = null
let _SCORE = 0

const WIDTH =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth
const HEIGHT =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight

class Game {
  constructor() {
    _CORE = new Core('view', WIDTH, HEIGHT)

    this._cooldawnToSpawnEnemy = 1 // spawn enemy every second
    this.lastSpawnedEnemyTimer = 0

    this.player = null
    this.enemies = []

    this.createPlayer()

    _CORE.addObject(this, 100)
    _CORE.start()
  }

  createPlayer() {
    this.player = new Player(WIDTH / 2, HEIGHT / 2, 30, '#cccccc')
    _CORE.addObject(this.player, 10)
  }
  createEnemy() {
    const enemyColor = '#e53935'
    const enemyRadius = 50

    const side = Math.floor(randomInRange(0, 4))
    const x = randomInRange(0, WIDTH)
    const y = randomInRange(0, HEIGHT)

    const enemyCoords = { x, y }

    if (side === 0) enemyCoords.y = -enemyRadius
    if (side === 1) enemyCoords.x = WIDTH + enemyRadius
    if (side === 2) enemyCoords.y = HEIGHT + enemyRadius
    if (side === 3) enemyCoords.x = -enemyRadius

    const newEnemy = new Enemy(
      enemyCoords.x,
      enemyCoords.y,
      enemyRadius,
      enemyColor,
      this.player
    )

    this.enemies.push(newEnemy)
    _CORE.addObject(newEnemy)
  }

  draw(ctx) {
    const borderColor = '#333333'
    const fillColor = '#66BB6A'

    // drawing health bar and points
    const length = 300
    const fat = length / 8
    ctx.save()
    ctx.translate(WIDTH - length - 50, 30)
    //ctx.rotate(this.angle);
    ctx.lineWidth = 3
    ctx.fillStyle = fillColor
    ctx.strokeStyle = borderColor

    // filling
    ctx.fillRect(0, 0, (length * this.player.health) / 100, fat)

    // border
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(length, 0)
    ctx.lineTo(length, fat)
    ctx.lineTo(0, fat)
    ctx.lineTo(0, 0)
    ctx.closePath()
    ctx.stroke()

    ctx.font = '32px sans-serif'
    ctx.fillStyle = '#333'
    ctx.fillText('Score: ' + _SCORE, 10, 30)

    ctx.restore()
  }

  update() {
    const now = Date.now()
    if (now - this.lastSpawnedEnemyTimer > this._cooldawnToSpawnEnemy * 1000) {
      this.createEnemy()
      this.lastSpawnedEnemyTimer = now
      this._cooldawnToSpawnEnemy -= 5 / 1000
    }

    if (this.player.health === 0) {
      console.log('You died...')
      console.log('You score: ' + _SCORE)
      _CORE.stop()
    }
    // console.log("update game obj");
  }
}

const game = new Game()

function calculateDistance(aX, aY, bX, bY) {
  const cX = bX - aX
  const cY = bY - aY
  return Math.sqrt(cX * cX + cY * cY)
}
function randomInRange(min, max) {
  return Math.random() * (max - min) + min
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
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
  }

  return rotatedVector
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
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y

  const xDist = otherParticle.x - particle.x
  const yDist = otherParticle.y - particle.y

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    )

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass
    const m2 = otherParticle.mass

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle)
    const u2 = rotate(otherParticle.velocity, angle)

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y
    }
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y
    }

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle)
    const vFinal2 = rotate(v2, -angle)

    // Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x
    particle.velocity.y = vFinal1.y

    otherParticle.velocity.x = vFinal2.x
    otherParticle.velocity.y = vFinal2.y
  }
}
