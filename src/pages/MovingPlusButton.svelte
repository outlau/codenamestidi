<script lang="ts">
  import { gameElementStore, inputButtonsVisible } from '../store';
  import { onDestroy, onMount } from 'svelte';
  import ProgressBar from '../components/ProgressBar.svelte';
  import { between } from '../lib/helpers';
  import { SupabaseObject } from '../db';

  let isDragging = false;

  let topY = 0;
  const topYMlt = 3;
  let success = false;
  let holding = false;

  let interval;
  onMount(() => {
    const draggable = document.getElementById('draggable');
    const plusContainer = document.getElementById('plus-container-id');
    draggable.style.left = `${plusContainer.offsetLeft}px`;
    draggable.style.top = `${plusContainer.offsetTop}px`;

    const offsetLeft = plusContainer.offsetLeft;
    const offsetTop = plusContainer.offsetTop;

    interval = setInterval(() => {
      console.log(success);
      if (!holding) {
        topY += topYMlt;
      }
      if (topY > window.innerHeight) {
        topY = 0;
      }
      draggable.style.top = `${topY}px`;
      if (
        holding &&
        between(
          draggable.style.top.split('px')[0],
          offsetTop - 2,
          offsetTop + 2
        )
      ) {
        clearInterval(interval);
        success = true;

      }
    }, 16);

    function downEvent() {
      holding = true;
    }

    // Mouse Up Event
    function upEvent(event) {
      holding = false;
    }

    window.addEventListener('mousedown', downEvent);
    window.addEventListener('touchstart', downEvent);

    window.addEventListener('mouseup', upEvent);
    window.addEventListener('touchend', upEvent);
  });

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

<ProgressBar />
{#if !success}
  <div id="draggable">+</div>
{/if}
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
    <p class="button-explain-text">{success ? 'Finish task' : 'Uh oh'}</p>
  </div>
</div>

<style lang="scss">
  // TODO
  $main-color: #0e3c79;

  #draggable {
    cursor: pointer;
    position: absolute;
    color: $main-color;
    width: 50px;
    height: 50px;
    font-size: 30px;
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
        user-select: none;
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
