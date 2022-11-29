<script lang="ts">
  import { gameElementStore, inputButtonsVisible } from '../store';
  import { onDestroy, onMount } from 'svelte';
  import ProgressBar from '../components/ProgressBar.svelte';
  import { SupabaseObject } from '../db';
  import ButtonGroup from '../components/ButtonGroup.svelte';

  let isDragging = false;

  let mouseX = 0;
  let mouseY = 0;

  let curDraggable = null;

  let dx = 0;
  let dy = 0;

  let prevX = 0;
  let prevY = 0;

  let interval;

  onMount(() => {
    inputButtonsVisible.set(true);

    window.addEventListener('mousemove', moveEvent);
    window.addEventListener('touchmove', moveEvent);

    // Mouse Up Event
    function upEvent(event) {
      clearInterval(interval);
      interval = setInterval(() => {
        dx = mouseX - prevX;
        dy = mouseY - prevY;

        curDraggable.style.left =
          Number(curDraggable.style.left.split('px')[0]) + dx + 'px';
        curDraggable.style.top =
          Number(curDraggable.style.top.split('px')[0]) + dy + 'px';
        if (
          Number(curDraggable.style.left.split('px')[0]) < -50 ||
          Number(curDraggable.style.left.split('px')[0]) >
            document.body.clientWidth - 75 ||
          Number(curDraggable.style.top.split('px')[0]) < -50 ||
          Number(curDraggable.style.top.split('px')[0]) >
            document.body.clientHeight - 75
        ) {
          clearInterval(interval);
          curDraggable.style.visibility = 'hidden';
        }
      }, 16);
      isDragging = false;
    }
    window.addEventListener('mouseup', upEvent);
    window.addEventListener('touchend', upEvent);

    // Handle Mouse Coordinates
  });

  function setMouseCoordinates(event) {
    if (event.touches) {
      mouseX = event.touches[0].clientX; // - boundings.left;
      mouseY = event.touches[0].clientY; //- boundings.top;
    } else {
      mouseX = event.clientX; // - boundings.left;
      mouseY = event.clientY; // - boundings.top;
    }
  }

  function moveEvent(event) {
    if (isDragging) {
      prevX = mouseX;
      prevY = mouseY;
      curDraggable.style.left = mouseX - 25 + 'px';
      curDraggable.style.top = mouseY - 25 + 'px';

      setMouseCoordinates(event);
    }
  }

  function downEvent(event) {
    setMouseCoordinates(event);
    isDragging = true;
    curDraggable = event.target;
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
  });
</script>

{#each Array(500).fill(null) as _, i}
  <div
    class="draggable"
    on:touchstart="{downEvent}"
    style="left: {Math.random() * 90}%; top: {Math.random() * 90}%"
  ></div>
{/each}
<ProgressBar />
<ButtonGroup />

<style lang="scss">
  // TODO
  $main-color: #0e3c79;

  #draggable-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .draggable {
    background-image: url('/images/snowball.png');
    background-size: contain;
    //background: #424242;
    cursor: pointer;
    position: absolute;
    color: $main-color;
    width: 50px;
    height: 50px;
    font-size: 30px;
    z-index: 100;
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
