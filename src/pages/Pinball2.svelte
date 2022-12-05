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
  } from "matter-js";
  import { onMount } from "svelte";
  import ButtonGroup from "../components/ButtonGroup.svelte";
  import { inputButtonsVisible } from "../store";
  import { clamp } from "../lib/helpers";
  import ProgressBar from "../components/ProgressBar.svelte";
  import "@interactjs/auto-start";
  import "@interactjs/actions/drag";
  import "@interactjs/actions/resize";
  import "@interactjs/modifiers";
  import "@interactjs/dev-tools";
  import interact from "@interactjs/interact";

  let engine;
  let canvasWidth;
  let canvasHeight;

  let isDragging = false;

  let mouseX = 0;
  let mouseY = 0;

  onMount(() => {
    const canvasContainer = document.getElementById("canvas-container");

    canvasWidth = canvasContainer.offsetWidth;
    canvasHeight = document.body.clientHeight - 200;
    // create engine
    engine = Engine.create();
    const world = engine.world;

    // create renderer
    const render = Render.create({
      element: canvasContainer,
      engine: engine,
      options: {
        background: "transparent",
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

    const collisionBox = Bodies.rectangle(
      canvasWidth / 2 + 10,
      canvasHeight - 100 + 15,
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
          fillStyle: "transparent",
          strokeStyle: "transparent",
        },
      }),
      Bodies.rectangle(0, canvasHeight / 2, 2, canvasHeight, {
        isStatic: true,
        render: {
          fillStyle: "transparent",
          strokeStyle: "transparent",
        },
      }),
      Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, 2, {
        isStatic: true,
        render: {
          fillStyle: "transparent",
          strokeStyle: "transparent",
        },
      }),
      Bodies.rectangle(canvasWidth / 2, canvasHeight, canvasWidth, 2, {
        isStatic: true,
        render: {
          fillStyle: "black",
          strokeStyle: "black",
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
            fillStyle: "transparent",
            strokeStyle: "transparent",
          },
        }
      ),

      Bodies.rectangle(canvasWidth / 2, canvasHeight - 100, 2, 30, {
        isStatic: true,
      }),
      Bodies.rectangle(canvasWidth / 2 + 20, canvasHeight - 100, 2, 30, {
        isStatic: true,
      }),
      collisionBox,

      Bodies.polygon(canvasWidth + 40, -40, 8, 100, {
        isStatic: true,
        render: {
          fillStyle: "transparent",
          strokeStyle: "transparent",
        },
      }),
    ]);

    // run the renderer
    Render.run(render);

    // run the engine
    Runner.run(runner, engine);

    Events.on(engine, "collisionStart", function (event) {
      const pairs = event.pairs;
      if (pairs[0].bodyA.id == collisionBox.id) {
        inputButtonsVisible.set(true);
      }
    });

    /*
     * HANDLE PINBALL BUTTON
     */

    const draggable = document.getElementById("draggable");
    draggable.style.left = `${canvasWidth - draggable.offsetWidth}px`;
    draggable.style.top = `${canvasHeight}px`;

    interact("#draggable").draggable({
      // enable inertial throwing
      inertia: true,

      // enable autoScroll
      autoScroll: true,

      listeners: {
        // call this function on every dragmove event
        move: dragMoveListener,

        // call this function on every dragend event
        end: (event) => {
          const velocity = 10;
          const startTop = draggable.getBoundingClientRect().top;
          let pos = canvasHeight - startTop;
          spawnBall((startTop - canvasHeight) / 100);
          const interval = setInterval(() => {
            const top = startTop;
            draggable.style.transform = `translate(0px, ${pos}px)`;
            draggable.setAttribute("data-y", pos.toString());
            if (pos <= 0) {
              draggable.style.transform = `translate(0px, 0px)`;
              draggable.setAttribute("data-y", "0");
              clearInterval(interval);
              return;
            }
            pos -= velocity;
          }, 16);
        },
      },
    });
    function dragMoveListener(event) {
      var target = event.target;
      // keep the dragged position in the data-x/data-y attributes
      // var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
      var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

      // translate the element
      if (y > 150 || y <= 0) {
        return;
      }
      target.style.transform = "translate(0px, " + y + "px)";

      // update the posiion attributes
      // target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    }
  });

  function spawnBall(force: number) {
    const ballRadius = 5;
    const ball = Bodies.circle(
      canvasWidth - ballRadius / 2,
      canvasHeight - ballRadius / 2,
      ballRadius,
      {
        render: {
          fillStyle: "red",
        },
      }
    );
    const max = 0.0032;
    const yForce = max * force;
    ball.force = { x: 0, y: -yForce };
    Composite.add(engine.world, [ball]);
  }
</script>

<div id="canvas-container" />
<ProgressBar />

<ButtonGroup />
<div id="draggable">↓</div>
<div id="drag-indicator" />

<style lang="scss">
  #draggable {
    cursor: pointer;
    position: absolute;
    width: 50px;
    height: 50px;
    font-size: 30px;
    border: 1px solid black;
    z-index: 100;
    touch-action: none;
    user-select: none;
  }

  #drag-indicator {
    position: absolute;
    width: 50px;
    height: 1px;
    background: black;
    // todo this is not generic
    top: calc(100% - 1px);
    right: 0;
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
