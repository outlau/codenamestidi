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

  onMount(() => {
    const draggable = document.getElementById('draggable');
    const plusContainer = document.getElementById('plus-container-id');
    const offsetLeft = plusContainer.offsetLeft;
    const offsetTop = plusContainer.offsetTop;

    draggable.style.left = '40px';
    draggable.style.top = '40px';

    // Mouse Down Event
    function downEvent(event) {
      if (success) return;
      setMouseCoordinates(event);
      isDragging = true;

      // Start Drawing
    }
    draggable.addEventListener('mousedown', downEvent);
    draggable.addEventListener('touchstart', downEvent);

    // Mouse Move Event
    function moveEvent(event) {
      if (isDragging) {
        draggable.style.left = mouseX - 25 + 'px';
        draggable.style.top = mouseY - 25 + 'px';
        if (
          between(mouseX - 25, offsetLeft - 2, offsetLeft + 2) &&
          between(mouseY - 25, offsetTop - 2, offsetTop + 2)
        ) {
          isDragging = false;
          success = true;
        } else {
          success = false;
        }
        setMouseCoordinates(event);

        if (width >= 100) {
          inputButtonsVisible.set(true);
        } else {
          inputButtonsVisible.set(false);
        }
      }
    }
    window.addEventListener('mousemove', moveEvent);
    window.addEventListener('touchmove', moveEvent);

    // Mouse Up Event
    function upEvent(event) {
      isDragging = false;
    }
    window.addEventListener('mouseup', upEvent);
    window.addEventListener('touchend', upEvent);

    // Handle Mouse Coordinates
    function setMouseCoordinates(event) {
      if (event.touches) {
        mouseX = event.touches[0].clientX; // - boundings.left;
        mouseY = event.touches[0].clientY; //- boundings.top;
      } else {
        mouseX = event.clientX; // - boundings.left;
        mouseY = event.clientY; // - boundings.top;
      }
    }
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
