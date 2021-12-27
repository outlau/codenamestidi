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
  let color = 'rgb(0,0,0)';
  onMount(() => {
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
  let success = false;

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
      gyroCompleted.set(true)
    } else {
      gyroCompleted.set(false)
    }
    color = `rgb(${rgbX},${rgbY},${rgbZ})`;
  }

  function clamp(input: number, min: number, max: number): number {
    return input < min ? min : input > max ? max : input;
  }

  function map(
    current: number,
    in_min: number,
    in_max: number,
    out_min: number,
    out_max: number
  ): number {
    const mapped: number =
      ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
    return clamp(mapped, out_min, out_max);
  }

  function between(val, min, max) {
    return val >= min && val <= max;
  }
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
{#if gameElement}
  <div class="showcase-container"></div>
  <div class="progress-container">
    <div class="text-of-day">
      {gameElement.textOfDay}<br />
      {counter}/{maxCount}
    </div>
    <div
      class="progress-bar"
      style="width: {100}%; background-color: {color}"
    ></div>
  </div>
{/if}

<style lang="scss">
  $main-color: #0e3c79;

  .text-of-day {
    z-index: 10;
    color: white;
  }

  .showcase-container {
    background-color: $main-color;
    width: 50px;
    height: 50px;
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
