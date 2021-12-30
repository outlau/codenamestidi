<script lang="ts">
  import { gameElementStore, inputButtonsVisible } from '../store';
  import { onDestroy, onMount } from 'svelte';
  import ButtonGroup from '../components/ButtonGroup.svelte';

  let isDragging = false;

  let mouseX = 0;
  let mouseY = 0;
  let width = 50;

  const force = 0.01;
  let dy = 0;
  let angle = 0;
  onMount(() => {
    setInterval(() => {
      const force = -Math.sin((angle * Math.PI) / 180);
      dy += force / 4;
      width += dy;
      if (width >= 100) {
        width = 100;
        dy = 0;
        inputButtonsVisible.set(true);
        return;
      }
      inputButtonsVisible.set(false);
      if (width < 0) {
        width = 0;
        dy = 0;
      }
    }, 30);

    const progressContainer = document.getElementById('progress-container-id');
    const leftCenter =
      progressContainer.offsetLeft + progressContainer.offsetWidth / 2;
    const topCenter =
      progressContainer.offsetTop + progressContainer.offsetHeight / 2;

    // Mouse Down Event
    function downEvent(event) {
      setMouseCoordinates(event);
      isDragging = true;
    }
    progressContainer.addEventListener('mousedown', downEvent);
    progressContainer.addEventListener('touchstart', downEvent);

    // Mouse Move Event
    function moveEvent(event) {
      if (isDragging) {
        const x = mouseX - leftCenter;
        const y = topCenter - mouseY;
        angle = Math.atan(y / x) * (180 / Math.PI);

        angle += 360;
        if (x < 0) {
          angle += 180;
        }
        angle %= 360;
        setMouseCoordinates(event);
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

<div
  id="progress-container-id"
  style="transform: {`rotateZ(-${angle}deg`}"
  class="progress-container"
>
  <div class="text-of-day">
    {$gameElementStore.textOfDay}<br />
    {$gameElementStore.currentCount}/{$gameElementStore.maxCount}
  </div>
  <div class="progress-bar" style="width: {width}%"></div>
</div>

<ButtonGroup />

<style lang="scss">
  .progress-container:hover {
    cursor: pointer;
  }

  .progress-bar {
    transition: unset;
  }
</style>
