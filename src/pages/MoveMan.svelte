<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { gameElementStore, inputButtonsVisible } from '../store';
  import ButtonGroup from '../components/ButtonGroup.svelte';
  import { between } from '../lib/helpers';
  import ProgressBar from '../components/ProgressBar.svelte';
  import { SupabaseObject } from '../db';

  let interval;

  let success = false;

  let xVelocity = 0;
  let yVelocity = 0;

  let xVelocityMlt = 3;
  let yVelocityMlt = 3;

  let plusPosX = '0px';
  let plusPosY = '0px';
  onMount(() => {
    inputButtonsVisible.set(true);

    const man = document.getElementById('man');
    const plus = document.getElementById('plus');

    const plusContainer = document.getElementById('plus-container-id');
    const offsetLeft = plusContainer.offsetLeft;
    const offsetTop = plusContainer.offsetTop;

    plus.style.left = '30px';
    plus.style.top = '30px';
    plusPosX = plus.style.left;
    plusPosY = plus.style.top;

    interval = setInterval(() => {
      // console.log(man.style.left);
      const boundingRectMan = man.getBoundingClientRect();
      const boundingRectPlus = plus.getBoundingClientRect();

      man.style.left = `${
        Number(man.style.left.split('px')[0]) + xVelocity * xVelocityMlt
      }px`;
      man.style.top = `${
        Number(man.style.top.split('px')[0]) + yVelocity * yVelocityMlt
      }px`;

      if (success) {
        return;
      }

      console.log({ offsetLeft, offsetTop });
      console.log({ left: boundingRectPlus.left, top: boundingRectPlus.top });

      if (
        between(boundingRectPlus.left - 14, offsetLeft - 2, offsetLeft + 2) &&
        between(boundingRectPlus.top - 15, offsetTop - 2, offsetTop + 2)
      ) {
        success = true;
      } else {
        success = false;
      }

      if (
        boundingRectMan.left <= boundingRectPlus.right &&
        boundingRectMan.right >= boundingRectPlus.right &&
        boundingRectMan.top <= boundingRectPlus.bottom &&
        boundingRectMan.bottom >= boundingRectPlus.top
      ) {
        // Hit left side
        plus.style.left = `${
          Number(plus.style.left.split('px')[0]) + -1 * xVelocityMlt
        }px`;
        return;
      }
      if (
        boundingRectMan.left <= boundingRectPlus.left &&
        boundingRectMan.right >= boundingRectPlus.left &&
        boundingRectMan.top <= boundingRectPlus.bottom &&
        boundingRectMan.bottom >= boundingRectPlus.top
      ) {
        // Hit right side
        plus.style.left = `${
          Number(plus.style.left.split('px')[0]) + 1 * xVelocityMlt
        }px`;
        return;
      }

      if (
        boundingRectMan.left <= boundingRectPlus.right &&
        boundingRectMan.right >= boundingRectPlus.left &&
        boundingRectMan.top <= boundingRectPlus.top &&
        boundingRectMan.bottom >= boundingRectPlus.top
      ) {
        // Hit bottom side
        plus.style.top = `${
          Number(plus.style.top.split('px')[0]) + 1 * yVelocityMlt
        }px`;
        return;
      }

      if (
        boundingRectMan.left <= boundingRectPlus.right &&
        boundingRectMan.right >= boundingRectPlus.left &&
        boundingRectMan.top <= boundingRectPlus.bottom &&
        boundingRectMan.bottom >= boundingRectPlus.bottom
      ) {
        // Hit top side
        plus.style.top = `${
          Number(plus.style.top.split('px')[0]) + -1 * yVelocityMlt
        }px`;
        return;
      }
    }, 16.666666666666668);
  });

  function setVelocity(dir: string) {
    switch (dir) {
      case 'right':
        xVelocity = 1;
        console.log({ xVelocity });
        break;
      case 'left':
        xVelocity = -1;
        break;
      case 'up':
        yVelocity = -1;
        break;
      case 'down':
        yVelocity = 1;
        break;
    }
  }

  function unsetVelocity(dir: string) {
    switch (dir) {
      case 'right':
      case 'left':
        xVelocity = 0;
        break;
      case 'up':
      case 'down':
        yVelocity = 0;
        break;
    }
  }

  function increment() {
    if ($gameElementStore.currentCount < $gameElementStore.maxCount) {
      $gameElementStore.currentCount++;
      SupabaseObject.setGameElementCount($gameElementStore);
    }
  }

  function decrement() {
    if ($gameElementStore.currentCount > 0) {
      $gameElementStore.currentCount--;
      SupabaseObject.setGameElementCount($gameElementStore);
    }
  }

  onDestroy(() => {
    inputButtonsVisible.set(false);
    clearInterval(interval);
  });
</script>

{#if !success}
  <div id="plus">
    <div style="position: absolute; left: -1px; top: -15px;">+</div>
  </div>
{/if}
<img
  id="man"
  class="man-img"
  src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Aiga_toiletsq_men.svg"
/>

<ProgressBar />

<div class="button-group-container">
  <div class="button-container">
    <button
      class="change-button"
      disabled="{$gameElementStore.currentCount <= 0}"
      on:click="{decrement}"
    >
      -
    </button>
    <p class="button-explain-text">Revert</p>
  </div>
  <div class="button-container">
    <button
      id="plus-container-id"
      class="change-button"
      disabled="{!success ||
        $gameElementStore.currentCount >= $gameElementStore.maxCount}"
      on:click="{increment}"
      >{#if success}+{/if}</button
    >
    <p class="button-explain-text">{success ? 'Finish task' : 'Not again'}</p>
  </div>
</div>

<div class="bottom-container">
  <div
    class="arrow"
    on:touchstart="{() => setVelocity('up')}"
    on:mousedown="{() => setVelocity('up')}"
    on:touchend="{() => unsetVelocity('up')}"
    on:mouseup="{() => unsetVelocity('up')}"
  >
    ↑
  </div>
  <div
    class="arrow"
    on:touchstart="{() => setVelocity('down')}"
    on:mousedown="{() => setVelocity('down')}"
    on:touchend="{() => unsetVelocity('down')}"
    on:mouseup="{() => unsetVelocity('down')}"
  >
    ↓
  </div>
  <div
    class="arrow"
    on:touchstart="{() => setVelocity('right')}"
    on:mousedown="{() => setVelocity('right')}"
    on:touchend="{() => unsetVelocity('right')}"
    on:mouseup="{() => unsetVelocity('right')}"
  >
    →
  </div>
  <div
    class="arrow"
    on:touchstart="{() => setVelocity('left')}"
    on:mousedown="{() => setVelocity('left')}"
    on:touchend="{() => unsetVelocity('left')}"
    on:mouseup="{() => unsetVelocity('left')}"
  >
    ←
  </div>
</div>

<style lang="scss">
  // TODO
  $main-color: #0e3c79;

  .showcase-container {
    background-color: $main-color;
  }

  .progress-bar {
    transition: unset;
  }

  .bottom-container {
    position: absolute;
    bottom: 0;
    margin: auto;
    display: flex;
    width: 100%;
    left: 0;
    justify-content: space-around;
  }

  .man-img {
    position: absolute;
    width: 10px;
    //border: 1px solid $main-color;
    z-index: 10;
  }

  .arrow {
    font-size: 50px;
  }

  #plus {
    z-index: 10;
    position: absolute;
    color: $main-color;
    font-size: 30px;
    //border: 1px solid $main-color;
    width: 20px;
    height: 22px;

    display: flex;
    align-items: center;
  }

  .button-group-container {
    margin-top: 15px;

    display: flex;
    justify-content: space-between;

    .button-container {
      .button-explain-text {
        margin-top: 10px;
        font-size: 12px;
        font-style: italic;
      }

      .explain-dialog {
        padding: 16px;
      }

      .change-button {
        display: flex;
        justify-content: center;
        box-shadow: 0.5px 1px 4px 1px transparentize($main-color, 0.8);
        border: 0;
        background: unset;
        border-radius: 50%;
        color: $main-color;
        width: 50px;
        height: 50px;
        font-size: 30px;
        margin: 0 10px;
        transition: 0.3s all;

        &:disabled {
          background: #ccc;
          color: transparentize($main-color, 0.8);
          cursor: not-allowed !important;
        }

        &:hover {
          background: #f3f3f3;
          cursor: pointer;
        }
      }
    }
  }
</style>
