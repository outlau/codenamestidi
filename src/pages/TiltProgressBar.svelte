<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { gameElementStore, inputButtonsVisible } from '../store';
  import ButtonGroup from '../components/ButtonGroup.svelte';

  let width = 0;

  function deviceOrientationHandler(eventData) {
    console.log('log');
    // gamma: Tilting the device from left to right. Tilting the device to the right will result in a positive value.
    let tiltLR = eventData.gamma;
    let output = (100 / 40) * tiltLR - 20;
    if (output < 0) output = 0;
    if (output >= 100) {
      output = 100;
      inputButtonsVisible.set(true);
    } else {
      inputButtonsVisible.set(false);
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
  }

  onMount(() => {
    if (window.DeviceOrientationEvent) {
      window.addEventListener(
        'deviceorientation',
        deviceOrientationHandler,
        false
      );
    }

    // function deviceOrientationHandler(tiltLR, tiltFB, dir) {
    //   document.getElementById('tiltLR').innerHTML = Math.ceil(tiltLR);
    //   document.getElementById('tiltFB').innerHTML = Math.ceil(tiltFB);
    //   document.getElementById('direction').innerHTML = Math.ceil(dir);
    // }
  });

  onDestroy(() => {
    window.removeEventListener('deviceorientation', deviceOrientationHandler);
    inputButtonsVisible.set(false);
  });
</script>

<div class="progress-container">
  <div class="text-of-day">
    {$gameElementStore.textOfDay}<br />
    {$gameElementStore.currentCount}/{$gameElementStore.maxCount}
  </div>
  <div class="progress-bar" style="width: {width}%"></div>
</div>
<ButtonGroup />

<style lang="scss">
  .progress-container {
    transition: unset;
  }
</style>
