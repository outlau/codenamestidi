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
  let lat = 0;
  let long = 0;
  let message = '';
  onMount(() => {
    let geo = navigator.geolocation;
    console.log(geo);
    navigator.geolocation.watchPosition((success) => {
      long = success.coords.latitude;
      lat = success.coords.longitude;
      console.log(success);
    }, (error)=>{
      message = error.message;
    });
  });

</script>

{#if gameElement}
  {lat}
  <br>
  {long}
  <br>
  {message}
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
