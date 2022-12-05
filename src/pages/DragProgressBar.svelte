<script lang="ts">
  import { gameElementStore, inputButtonsVisible } from '../store';
  import { onDestroy, onMount } from 'svelte';
  import ButtonGroup from '../components/ButtonGroup.svelte';
  import { clamp, map } from '../lib/helpers';

  let isDragging = false;

  let mouseX = 0;
  let mouseY = 0;
  let width = 0;

  onMount(() => {
    const draggable = document.getElementById('draggable');
    const progressContainer = document.getElementById('progress-container-id');
    const offsetLeft = progressContainer.offsetLeft;
    const offsetWidth = progressContainer.offsetWidth;

    draggable.style.left = offsetLeft + 20 + 'px';
    width = map(
      offsetLeft + 20,
      offsetLeft,
      offsetLeft + offsetWidth - 40,
      0,
      100
    );
    draggable.style.top = progressContainer.offsetTop + 'px';
    console.log(offsetLeft);
    console.log(offsetWidth);

    // Mouse Down Event
    function downEvent(event) {
      setMouseCoordinates(event);
      isDragging = true;

      // Start Drawing
    }
    draggable.addEventListener('mousedown', downEvent);
    draggable.addEventListener('touchstart', downEvent);

    // Mouse Move Event
    function moveEvent(event) {
      if (isDragging) {
        width = map(
          mouseX - 20,
          offsetLeft,
          offsetLeft + offsetWidth - 40,
          0,
          100
        );

        draggable.style.left =
          clamp(mouseX - 20, offsetLeft, offsetLeft + offsetWidth - 40) + 'px';
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

  onDestroy(() => {
    inputButtonsVisible.set(false);
  });
</script>

<div id="progress-container-id" class="progress-container">
  <div class="text-of-day">
    {$gameElementStore.textOfDay}<br />
    {$gameElementStore.currentCount}/{$gameElementStore.maxCount}
  </div>
  <div class="progress-bar" style="width: {width}%"></div>
</div>
<div id="draggable"></div>

<ButtonGroup />

<style lang="scss">
  #draggable {
    position: absolute;
    height: 60px;
    width: 40px;
    //background-color: blue;

    &:hover {
      cursor: pointer;
    }
  }

  .progress-bar {
    transition: unset;
  }
</style>
