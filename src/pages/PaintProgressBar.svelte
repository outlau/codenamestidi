<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { gameElementStore, inputButtonsVisible } from '../store';
  import ButtonGroup from '../components/ButtonGroup.svelte';

  let x = 0;
  let y = 0;
  let z = 0;
  let interval;
  onMount(() => {
    inputButtonsVisible.set(false);
    // Definitions
    const canvas = document.getElementById('paint-canvas');
    const context = canvas.getContext('2d');
    const boundings = canvas.getBoundingClientRect();

    // Get the CanvasPixelArray from the given coordinates and dimensions.

    // Draw the ImageData at the given (x,y) coordinates.
    //     context.putImageData(imgd, x, y);

    // Specifications
    let mouseX = 0;
    let mouseY = 0;
    context.strokeStyle = '#0E3C79'; // initial brush color
    context.lineWidth = 40; // initial brush width
    let isDrawing = false;

    let finished = false;

    interval = setInterval(() => {
      console.log(finished);
      if (finished) {
        return;
      }
      const imgd = context.getImageData(x, y, 200, 60);
      const pix = imgd.data;
      for (let i = 0, n = pix.length; i < n; i += 4) {
        if (!(pix[i] > 0 && pix[i + 1] > 0 && pix[i + 2] > 0)) {
          inputButtonsVisible.set(false);
          return;
        }
      }
      inputButtonsVisible.set(true);
      finished = true;
    }, 1000);

    // Mouse Down Event
    function downEvent(event) {
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

  onDestroy(() => {
    clearInterval(interval);
    inputButtonsVisible.set(false);
  });
</script>

<div class="right-block"></div>
<div class="progress-container">
  <div class="text-of-day">
    {$gameElementStore.textOfDay}<br />
    {$gameElementStore.currentCount}/{$gameElementStore.maxCount}
  </div>
  <canvas id="paint-canvas" width="200" height="60"></canvas>
</div>

<ButtonGroup />

<style lang="scss">
  .text-of-day {
    position: absolute;
  }
</style>
