<script lang="ts">
  import { gameElementStore, inputButtonsVisible } from '../store';
  import { onDestroy, onMount } from 'svelte';
  import ProgressBar from '../components/ProgressBar.svelte';
  import { between } from '../lib/helpers';
  import { SupabaseObject } from '../db';

  let isDragging = false;

  let mouseX = 0;
  let mouseY = 0;
  let width = 0;

  let success = false;

  let dx = 0;
  let dy = 0;
  let dz = 0;

  let velocityMlt = 1;

  let x = document.body.clientWidth / 2;
  let y = document.body.clientHeight / 2;

  onMount(() => {
    const draggable = document.getElementById('draggable');
    const plusContainer = document.getElementById('plus-container-id');
    const offsetLeft = plusContainer.offsetLeft;
    const offsetTop = plusContainer.offsetTop;

    inputButtonsVisible.set(false);
    // @ts-ignore
    let acl = new Accelerometer({ frequency: 60 });
    acl.addEventListener('reading', () => {
      if (success) {
        return;
      }
      dx = acl.x;
      dy = acl.y;
      dz = acl.z;

      x -= dx * velocityMlt;
      y += dy * velocityMlt;
      const clientOffset = 50;

      if (
        y < 0 ||
        y > document.body.clientHeight - clientOffset ||
        x < 0 ||
        x > document.body.clientWidth - clientOffset
      ) {
        if (y < 0) {
          dy = 0;
          y = 0;
          draggable.style.left = `${x}px`;
          draggable.style.top = `${y}px`;
        }
        if (y > document.body.clientHeight - clientOffset) {
          dy = 0;
          y = document.body.clientHeight - clientOffset;
          draggable.style.left = `${x}px`;
          draggable.style.top = `${y}px`;
        }
        if (x < 0) {
          dx = 0;
          x = 0;
          draggable.style.left = `${x}px`;
          draggable.style.top = `${y}px`;
        }
        if (x > document.body.clientWidth - clientOffset) {
          dx = 0;
          x = document.body.clientWidth - clientOffset;
          draggable.style.left = `${x}px`;
          draggable.style.top = `${y}px`;
        }
        return;
      }

      if (
        between(x, offsetLeft - 2, offsetLeft + 2) &&
        between(y, offsetTop - 2, offsetTop + 2)
      ) {
        success = true;
        console.log('GREAT');
        return;
      }
      console.log({ draggableLeft: draggable.style.left });
      console.log({ draggableTop: draggable.style.top });
      console.log({ offsetLeft });
      console.log({ offsetTop });
      draggable.style.left = `${x}px`;
      draggable.style.top = `${y}px`;
    });

    acl.start();
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
