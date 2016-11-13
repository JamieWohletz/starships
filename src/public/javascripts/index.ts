declare var Matter: any;
const WIDTH = document.body.clientWidth;
const HEIGHT = document.body.clientHeight;

const SHIP_LENGTH = 100;
const SHIP_WIDTH = 50;
const ANGULAR_INCREMENT = 0.01;
const VELOCITY_INCREMENT = 0.1; 
enum DIRECTION {
  FORWARD,
  BACKWARD
}

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Body = Matter.Body,
  Vector = Matter.Vector,
  Events = Matter.Events,
  Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
  canvas: document.getElementById('game-canvas'),
  engine: engine,
  options: {
    wireframes: false,
    width: WIDTH,
    height: HEIGHT
  }
});

// engine.render.options.background = './images/starBackground.png';
engine.world.gravity.y = 0;

// create two boxes and a ground
var spaceship = Body.create({
  position: Vector.create(WIDTH / 2, HEIGHT / 2),
  inertia: Infinity,
  render: {
    sprite: {
      texture: './images/player.png'
    }
  },
  vertices: [
    {
      x: 0,
      y: 0
    },
    {
      x: 0,
      y: SHIP_WIDTH / 2
    }, 
    {
      x: SHIP_LENGTH,
      y: 0
    },
    {
      x: 0,
      y: - SHIP_WIDTH / 2
    }
  ]
});

// add all of the bodies to the world
World.add(engine.world, [spaceship]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

Events.on(engine, 'beforeUpdate', () => {
  if (spaceship.bounds.max.y <= 1) {
    Matter.Body.translate(spaceship, { x: 0, y: HEIGHT + (spaceship.bounds.max.y - spaceship.bounds.min.y) });
  }

  if (spaceship.bounds.min.y >= HEIGHT) {
    Matter.Body.translate(spaceship, { x: 0, y: -HEIGHT - (spaceship.bounds.max.y - spaceship.bounds.min.y) });
  }

  if (spaceship.bounds.max.x <= 1) {
    Matter.Body.translate(spaceship, { x: WIDTH + (spaceship.bounds.max.x - spaceship.bounds.min.x), y: 0 });
  }

  if (spaceship.bounds.min.x >= WIDTH) {
    Matter.Body.translate(spaceship, { x: -WIDTH - (spaceship.bounds.max.x - spaceship.bounds.min.x), y: 0 });
  }
});

window.addEventListener('keydown', (event: KeyboardEvent) => {
  
  function move(direction : DIRECTION) {
    function calcVelocity(radians : number, increment : number) {
      return {
        x: Math.cos(radians) * increment,
        y: Math.sin(radians) * increment
      };
    }
    let angle = spaceship.angle - Math.PI / 2;
    let vel;
    if (direction === DIRECTION.FORWARD) {
      vel = calcVelocity(angle, VELOCITY_INCREMENT);
    }
    else {
      vel = calcVelocity(angle, -VELOCITY_INCREMENT);
    }
    Body.applyForce(spaceship, Vector.create(25, 0), Vector.create(vel.x, vel.y));
  }

  function rotate(clockwise : boolean = true) {
    let angular = spaceship.angularVelocity;
    Body.setAngularVelocity(spaceship, clockwise ? angular + ANGULAR_INCREMENT : angular - ANGULAR_INCREMENT);
  }
  switch (event.code) {
    case 'ArrowUp':
      move(DIRECTION.FORWARD);
      break;
    case 'ArrowDown':
      move(DIRECTION.BACKWARD);
      break;
    case 'ArrowRight':
      rotate(true);
      break;
    case 'ArrowLeft':
      rotate(false);      
      break;
    case 'Space':
        World.addBody(engine.world, Bodies.rectangle(spaceship.position.x, spaceship.position.y, 9, 33, {
          render: {
            sprite: {
              texture: './images/laserRed.png'
            }
          }
        }));
      break;
    default: 
      break;
  }
});