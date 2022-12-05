<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { gameElementStore, inputButtonsVisible } from '../store';
  import ButtonGroup from '../components/ButtonGroup.svelte';
  import { between } from '../lib/helpers';

  let x = 0;
  let y = 0;
  let z = 0;
  let color = 'rgb(0,0,0)';
  onMount(() => {
    inputButtonsVisible.set(false);
    let acl = new Accelerometer({ frequency: 60 });
    acl.addEventListener('reading', () => {
      x = acl.x;
      y = acl.y;
      z = acl.z;
      setColor();
      console.log('Acceleration along the X-axis ' + acl.x);
      console.log('Acceleration along the Y-axis ' + acl.y);
      console.log('Acceleration along the Z-axis ' + acl.z);
    });

    acl.start();
  });

  function getRgbVal(val) {
    return 127.5 * Math.sin(val / 8) + 127.5;
  }

  let rgbX = 0;
  let rgbY = 0;
  let rgbZ = 0;

  function setColor() {
    // 14 60 121
    rgbX = getRgbVal(x);
    rgbY = getRgbVal(y);
    rgbZ = getRgbVal(z);
    if (
      between(rgbX, 5, 20) &&
      between(rgbY, 40, 80) &&
      between(rgbZ, 110, 130)
    ) {
      inputButtonsVisible.set(true);
    } else {
      inputButtonsVisible.set(false);
    }
    color = `rgb(${rgbX},${rgbY},${rgbZ})`;
  }

  onDestroy(() => {
    inputButtonsVisible.set(false);
  });
</script>

<!--{rgbX.toLocaleString('en-US', {-->
<!--  minimumIntegerDigits: 2,-->
<!--  useGrouping: false,-->
<!--})} <br />-->
<!--{rgbY.toLocaleString('en-US', {-->
<!--  minimumIntegerDigits: 2,-->
<!--  useGrouping: false,-->
<!--})} <br />-->
<!--{rgbZ.toLocaleString('en-US', {-->
<!--  minimumIntegerDigits: 2,-->
<!--  useGrouping: false,-->
<!--})}-->
<div class="progress-container showcase-container"></div>
<div class="progress-container">
  <div class="text-of-day">
    {$gameElementStore.textOfDay}<br />
    {$gameElementStore.currentCount}/{$gameElementStore.maxCount}
  </div>
  <div
    class="progress-bar"
    style="width: 100%; background-color: {color}"
  ></div>
</div>

<ButtonGroup />

<style lang="scss">
  // TODO
  $main-color: #0e3c79;

  .showcase-container {
    background-color: $main-color;
  }

  .progress-bar {
    transition: unset;
  }
</style>
