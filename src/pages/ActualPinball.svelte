<script lang="ts">
  import {
    Engine,
    Render,
    Runner,
    Bodies,
    Composite,
    MouseConstraint,
    Mouse,
    Events,
  } from 'matter-js';
  import { onMount } from 'svelte';
  import ButtonGroup from '../components/ButtonGroup.svelte';
  import { inputButtonsVisible } from '../store';
  import ProgressBar from '../components/ProgressBar.svelte';

  let engine;
  let canvasWidth;
  let canvasHeight;

  onMount(() => {
    const canvasContainer = document.getElementById('canvas-container');

    canvasWidth = canvasContainer.offsetWidth;
    canvasHeight = 800;
    // create engine
    engine = Engine.create();
    const world = engine.world;

    // create renderer
    const render = Render.create({
      element: canvasContainer,
      engine: engine,
      options: {
        background: 'transparent',
        wireframes: false,
        width: canvasWidth,
        height: canvasHeight,
        showVelocity: true,
        showAngleIndicator: true,
      },
    });

    Render.run(render);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    engine.gravity.y = 0.2;

    // add mouse control
    const mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        collisionFilter: { mask: 0b10 },
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: canvasWidth, y: canvasHeight },
    });

    const numInRow = 15;
    const circles = Array(300)
      .fill(0)
      .map((_, i) => {
        const offset = (Math.floor(i / numInRow) % 6) * 13;
        return Bodies.circle(
          (((i * canvasWidth) / numInRow) % canvasWidth) +
            canvasWidth / (numInRow * 2) -
            20 +
            offset,
          Math.floor(i / numInRow) * 25 + 50,
          5,
          {
            isStatic: true,
            render: {
              fillStyle: 'rgba(0,0,0,0.4)',
            },
          }
        );
      });

    const collisionBox = Bodies.rectangle(
      canvasWidth / 2 + 10,
      canvasHeight - 200,
      20,
      2,
      {
        isStatic: true,
      }
    );

    // add all the bodies to the world
    Composite.add(engine.world, [
      // Bound start
      Bodies.rectangle(canvasWidth, canvasHeight / 2, 2, canvasHeight, {
        isStatic: true,
        render: {
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
        },
      }),
      Bodies.rectangle(0, canvasHeight / 2, 2, canvasHeight, {
        isStatic: true,
        render: {
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
        },
      }),
      Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, 2, {
        isStatic: true,
        render: {
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
        },
      }),
      Bodies.rectangle(canvasWidth / 2, canvasHeight, canvasWidth, 2, {
        isStatic: true,
        render: {
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
        },
      }),
      // Bound done

      Bodies.rectangle(canvasWidth / 2, canvasHeight - 200 - 5, 2, 10, {
        isStatic: true,
      }),
      Bodies.rectangle(canvasWidth / 2 + 20, canvasHeight - 200 - 5, 2, 10, {
        isStatic: true,
      }),
      collisionBox,

      Bodies.rectangle(
        canvasWidth - 60,
        canvasHeight / 2 + 50,
        2,
        canvasHeight - 100,
        {
          isStatic: true,
          render: {
            fillStyle: 'transparent',
            strokeStyle: 'transparent',
          },
        }
      ),

      Bodies.polygon(canvasWidth + 40, -40, 8, 100, {
        isStatic: true,
        render: {
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
        },
      }),

      ...circles,
    ]);

    // run the renderer
    Render.run(render);

    // run the engine
    Runner.run(runner, engine);

    window.addEventListener('click', (e) => {
      e.preventDefault();
      const ballRadius = 5;
      const ball = Bodies.circle(e.clientX - ballRadius / 2, 10, ballRadius, {
        render: {
          fillStyle: 'red',
        },
        restitution: 1,
      });
      Composite.add(engine.world, [ball]);
    });

    Events.on(engine, 'collisionStart', function (event) {
      const pairs = event.pairs;
      if (pairs[0].bodyA.id == collisionBox.id) {
        inputButtonsVisible.set(true);
      }
    });
  });
</script>

<div id="canvas-container"></div>

<ProgressBar />

<ButtonGroup />

<style lang="scss">
  #draggable {
    cursor: pointer;
    position: absolute;
    width: 50px;
    height: 50px;
    font-size: 30px;
    border: 1px solid black;
    z-index: 100;
  }

  #canvas-container {
    position: absolute;
    top: 0;
    width: 100%;
    pointer-events: none;
  }

  .spawn-ball {
    position: absolute;
    top: 800px;
    left: 0;
  }

  .progress-container {
    background-color: transparent;
  }

  #title-container {
    font-size: 2em;
    color: transparent;
    text-transform: uppercase;
    font-weight: 100;
    line-height: 1.2;
    margin-bottom: 50px;
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    z-index: 100;
  }
</style>
