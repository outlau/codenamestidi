<script lang="ts">
  import {
    Engine,
    Render,
    Runner,
    Bodies,
    Composite,
    Composites,
    Common,
    MouseConstraint,
    Mouse,
  } from 'matter-js';
  import { onMount } from 'svelte';
  import ButtonGroup from '../components/ButtonGroup.svelte';
  import { gameElementStore, inputButtonsVisible } from '../store';

  let engine;
  let canvasWidth;
  let canvasHeight;
  let progressBar: HTMLElement;
  onMount(() => {
    const canvasContainer = document.getElementById('canvas-container');
    progressBar = document.getElementById('game-progress-container');

    canvasWidth = canvasContainer.offsetWidth;
    canvasHeight = document.body.clientHeight;
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

    // add bodies
    Composite.add(world, [
      // Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      // Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      // Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ]);

    engine.gravity.y = 0.1;

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

    // create two boxes and a ground

    const boxC = Bodies.rectangle(200, 200, 100, 100, {
      chamfer: { radius: 20 },
      isStatic: true,
    });

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

      Bodies.rectangle(
        progressBar.offsetLeft,
        progressBar.offsetTop + progressBar.offsetHeight / 2,
        2,
        progressBar.offsetHeight,
        {
          isStatic: true,
        }
      ),
      Bodies.rectangle(
        progressBar.offsetLeft + progressBar.offsetWidth,
        progressBar.offsetTop + progressBar.offsetHeight / 2,
        2,
        progressBar.offsetHeight,
        {
          isStatic: true,
        }
      ),
      Bodies.rectangle(
        progressBar.offsetLeft + progressBar.offsetWidth / 2,
        progressBar.offsetTop + progressBar.offsetHeight,
        progressBar.offsetWidth,
        2,
        {
          isStatic: true,
        }
      ),

      Bodies.polygon(canvasWidth + 40, -40, 8, 100, {
        isStatic: true,
        render: {
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
        },
      }),
    ]);

    // run the renderer
    Render.run(render);

    // run the engine
    Runner.run(runner, engine);
  });

  function spawnBall() {
    const ballRadius = 5;
    const ball = Bodies.circle(
      canvasWidth - ballRadius / 2,
      canvasHeight - ballRadius / 2,
      ballRadius,
      {
        render: {
          fillStyle: 'red',
        },
      }
    );
    const max = 0.005;
    const min = 0.0035;
    const yForce = Math.random() * (min - max) + max;
    ball.force = { x: 0, y: -yForce };
    Composite.add(engine.world, [ball]);
  }

  let stiCount = 0;
  function setStiCount() {
    console.log(stiCount);
    stiCount++;
    if (stiCount >= 3) {
      inputButtonsVisible.set(true);
    }
  }
</script>

<div id="title-container">
  <div>The</div>
  <div>adventures of</div>
  <div on:click="{setStiCount}">Sti</div>
</div>
<div id="canvas-container"></div>
<div class="progress-container" id="game-progress-container">
  <div class="text-of-day">
    {$gameElementStore.textOfDay}<br />
    {$gameElementStore.currentCount}/{$gameElementStore.maxCount}
  </div>
  <div
    class="progress-bar"
    style="width: {(100 * $gameElementStore.currentCount) /
      $gameElementStore.maxCount}%"
  ></div>
</div>

<ButtonGroup />
<button class="spawn-ball" on:click="{spawnBall}">Spawn ball</button>

<style lang="scss">
  #canvas-container {
    position: absolute;
    top: 0;
    width: 100%;
    pointer-events: none;
  }

  .spawn-ball {
    position: absolute;
    bottom: 50px;
    left: 0;
    right: 0;
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
