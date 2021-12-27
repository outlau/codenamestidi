<script lang="ts">
  import type { GameElement } from '../game-element';
  import { onMount } from 'svelte';
  import { gyroCompleted } from '../store';
  export let gameElement: GameElement;
  export let counter;
  export let maxCount;

  let x = 0;
  let y = 0;
  let z = 0;

  let filled = false;
  onMount(() => {
    // Definitions
    var canvas = document.getElementById('paint-canvas');
    var context = canvas.getContext('2d');
    var boundings = canvas.getBoundingClientRect();

    // Get the CanvasPixelArray from the given coordinates and dimensions.

    // Draw the ImageData at the given (x,y) coordinates.
    //     context.putImageData(imgd, x, y);

    // Specifications
    var mouseX = 0;
    var mouseY = 0;
    context.strokeStyle = '#0E3C79'; // initial brush color
    context.lineWidth = 40; // initial brush width
    var isDrawing = false;

    setInterval(() => {
      const imgd = context.getImageData(x, y, 200, 60);
      const pix = imgd.data;
      // Loop over each pixel and invert the color.
      // console.log(pix);
      for (let i = 0, n = pix.length; i < n; i += 4) {
        if (!(pix[i] > 0 && pix[i + 1] > 0 && pix[i + 2] > 0)) {
          // console.log(i);
          filled = false;
          return;
        }
        filled = true;
      }
    }, 1000);

    // Mouse Down Event
    function downEvent(event) {
      console.log(event);
      setMouseCoordinates(event);
      isDrawing = true;

      // Start Drawing
      context.beginPath();
      context.moveTo(mouseX, mouseY);
    }
    canvas.addEventListener('mousedown', downEvent);
    canvas.addEventListener('touchstart', downEvent);

    // Mouse Move Event
    function moveEvent(event) {
      console.log(event);
      setMouseCoordinates(event);

      if (isDrawing) {
        context.lineTo(mouseX, mouseY);
        context.stroke();
      }
    }
    canvas.addEventListener('mousemove', moveEvent);
    canvas.addEventListener('touchmove', moveEvent);

    // Mouse Up Event
    function upEvent(event) {
      console.log(event);
      // setMouseCoordinates(event);
      isDrawing = false;
    }
    window.addEventListener('mouseup', upEvent);
    window.addEventListener('touchend', upEvent);

    // Handle Mouse Coordinates
    function setMouseCoordinates(event) {
      if (event.touches) {
        mouseX = event.touches[0].clientX - boundings.left;
        mouseY = event.touches[0].clientY - boundings.top;
      } else {
        mouseX = event.clientX - boundings.left;
        mouseY = event.clientY - boundings.top;
      }
    }
  });
</script>

{filled}
{#if gameElement}
  <div class="right-block"></div>
  <div class="progress-container">
    <div class="text-of-day">
      {gameElement.textOfDay}<br />
      {counter}/{maxCount}
    </div>
    <canvas id="paint-canvas" width="200" height="60"></canvas>
    <!--    <div-->
    <!--      class="progress-bar"-->
    <!--      style="width: {100}%; background-color: {color}"-->
    <!--    ></div>-->
  </div>
{/if}

<style lang="scss">
  $main-color: #0e3c79;

  .text-of-day {
    position: absolute;
    z-index: 10;
    color: white;
  }

  .showcase-container {
    background-color: $main-color;
    width: 50px;
    height: 50px;
  }

  .progress-container {
    border: 1px solid $main-color;
    margin: 60px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    border-radius: 5px;
    height: 60px;
    width: 200px;
    background-color: #b91f1f;
    .progress-bar {
      top: 0;
      left: 0;
      position: absolute;
      height: 100%;
      width: 50%;
      background-color: $main-color;
    }
  }
</style>
