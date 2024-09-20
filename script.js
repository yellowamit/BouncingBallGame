// set up canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let count = 0;
const score = document.querySelector("p");
const restartButton = document.querySelector("#restartButton");

// function to generate random RGB color value
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);

    this.color = color;
    this.size = size;
  }
  exits = true;
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= width) {
      this.velX = -Math.abs(this.velX);
    }

    if (this.x - this.size <= 0) {
      this.velX = Math.abs(this.velX);
    }

    if (this.y + this.size >= height) {
      this.velY = -Math.abs(this.velY);
    }

    if (this.y - this.size <= 0) {
      this.velY = Math.abs(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exits) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

class EvilCircle extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, 20, 20);
    this.color = "white";
    this.size = 10;
    this.velX = velX; // Adding these lines to initialize EvilCircle's velocity
    this.velY = velY;
  }
  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }
  checkBounds() {
    if (this.x + this.size >= width) {
      this.x = -Math.abs(this.x);
    }

    if (this.x - this.size <= 0) {
      this.x = +Math.abs(this.x);
    }

    if (this.y + this.size >= height) {
      this.x = -Math.abs(this.x);
    }

    if (this.y - this.size <= 0) {
      this.x = +Math.abs(this.x);
    }
  }
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exits) {
        const dx = evil.x - ball.x;
        const dy = evil.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.x = 0;
          ball.y = 0;
          ball.size = 0;
          ball.velX = 0;
          ball.velY = 0;

          count--;
          ball.exits = false;
        }
      }
    }
  }
}

const evil = new EvilCircle(20, 20, 20, 20, "white", 10);
const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
  count++;
}

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }

  evil.draw();
  evil.checkBounds();
  evil.collisionDetect();

  requestAnimationFrame(loop);
  score.textContent = count;
  if (count === 0) {
    // alert("gameover");
    restartButton.style.display = "block";
  }
}

loop();

canvas.addEventListener("mousemove", (event) => {
  evil.x = event.clientX;
  evil.y = event.clientY;
});

canvas.addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  evil.x = touch.clientX;
  evil.y = touch.clientY;
});

restartButton.addEventListener("click", () => {
  location.reload();
});
