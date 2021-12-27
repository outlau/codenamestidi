<script lang="ts">
  import type { GameElement } from '../game-element';
  import { onMount } from 'svelte';
  import { gyroCompleted } from '../store';
  export let gameElement: GameElement;
  export let counter;
  export let maxCount;

  let width = 0;

  onMount(() => {
    if (window.DeviceOrientationEvent) {
      window.addEventListener(
        'deviceorientation',
        (eventData) => {
          // gamma: Tilting the device from left to right. Tilting the device to the right will result in a positive value.
          let tiltLR = eventData.gamma;
          let output = (100 / 40) * tiltLR - 20;
          if (output < 0) output = 0;
          if (output >= 100) {
            output = 100;
            gyroCompleted.set(true);
          } else {
            gyroCompleted.set(false);
          }
          width = output;

          // setWidth();
          // beta: Tilting the device from the front to the back. Tilting the device to the front will result in a positive value.
          let tiltFB = eventData.beta;

          // alpha: The direction the compass of the device aims to in degrees.
          let dir = eventData.alpha;

          // Call the function to use the data on the page.
          // Roep de functie op om de data op de pagina te gebruiken.
          // deviceOrientationHandler(tiltLR, tiltFB, dir);
        },
        false
      );
    }

    // function deviceOrientationHandler(tiltLR, tiltFB, dir) {
    //   document.getElementById('tiltLR').innerHTML = Math.ceil(tiltLR);
    //   document.getElementById('tiltFB').innerHTML = Math.ceil(tiltFB);
    //   document.getElementById('direction').innerHTML = Math.ceil(dir);
    // }
  });

  let y;
  function setWidth() {}
</script>

{#if gameElement}
  <div class="progress-container">
    <div class="text-of-day">
      {gameElement.textOfDay}<br />
      {counter}/{maxCount}
    </div>
    <div class="progress-bar" style="width: {width}%"></div>
  </div>
{/if}

<style lang="scss">
  $main-color: #0e3c79;

  .text-of-day {
    z-index: 10;
    color: white;
  }

  .progress-container {
    margin: 60px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    border-radius: 5px;
    height: 60px;
    width: 100%;
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
