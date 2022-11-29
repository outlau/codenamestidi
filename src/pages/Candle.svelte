<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { gameElementStore, inputButtonsVisible } from '../store';
  import ButtonGroup from '../components/ButtonGroup.svelte';

  let isOn = false;
  let success = false;
  let isDragging = false;
  let mouseX = 0;
  let mouseY = 0;

  let candleOnBar = false;
  let progressColorPerc = 0;
  let progressColorMlt = 1;

  const endColor = {
    red: 14,
    green: 60,
    blue: 121,
  };

  const startColor = {
    red: 185,
    green: 31,
    blue: 31,
  };

  let progressColor = {
    red: startColor.red,
    green: startColor.green,
    blue: startColor.blue,
  };

  onMount(() => {
    inputButtonsVisible.set(false);

    setInterval(() => {
      if (candleOnBar && isOn) {
        progressColorPerc += progressColorMlt;
      } else {
        progressColorPerc -= progressColorMlt;
      }
      if (progressColorPerc >= 100) {
        inputButtonsVisible.set(true);
        progressColorPerc = 100;
      } else if (progressColorPerc <= 0) {
        progressColorPerc = 0;
      } else {
        inputButtonsVisible.set(false);
      }

      const diffRed = endColor.red - startColor.red;
      const diffGreen = endColor.green - startColor.green;
      const diffBlue = endColor.blue - startColor.blue;

      progressColor.red = (diffRed * progressColorPerc) / 100 + startColor.red;
      progressColor.green =
        (diffGreen * progressColorPerc) / 100 + startColor.green;
      progressColor.blue =
        (diffBlue * progressColorPerc) / 100 + startColor.blue;
    }, 100);

    const draggable = document.getElementById('draggable');
    const candle = document.getElementById('candle-container');
    const top = document.getElementById('top');
    const progressContainer = document.getElementById('progress-container-id');

    const progressContainerRect = progressContainer.getBoundingClientRect();
    const offsetLeft = progressContainerRect.left;
    const offsetRight = progressContainerRect.right;
    const offsetTop = progressContainerRect.top;
    const offsetBottom = progressContainerRect.bottom;

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
      const topRect = top.getBoundingClientRect();
      if (isDragging) {
        candle.style.left = mouseX - 25 + 'px';
        candle.style.top = mouseY - 200 + 'px';

        if (
          topRect.top + 100 > offsetTop &&
          topRect.top + 30 < offsetBottom &&
          topRect.left + 25 / 2 > offsetLeft &&
          topRect.left + 25 / 2 < offsetRight
        ) {
          candleOnBar = true;
        } else {
          candleOnBar = false;
        }
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

<div id="candle-container" class:candle="{isOn}" class:candle-unlit="{!isOn}">
  <div class="flame">
    <div class="shadows" style="{!isOn ? 'visibility: hidden' : null}"></div>
    <div
      id="top"
      class="top"
      style="{!isOn ? 'visibility: hidden' : null}"
    ></div>
    <div class="middle" style="{!isOn ? 'visibility: hidden' : null}"></div>
    <div class="bottom" style="{!isOn ? 'visibility: hidden' : null}"></div>
  </div>
  <div
    on:click="{() => (isOn = !isOn)}"
    class:wick="{isOn}"
    class:wick-unlit="{!isOn}"
  ></div>
  <div id="draggable" class="wax"></div>
</div>

<div
  id="progress-container-id"
  style="background-color: rgb({progressColor.red},{progressColor.green},{progressColor.blue})"
  class="progress-container"
>
  <div class="text-of-day">
    {$gameElementStore.textOfDay}<br />
    {$gameElementStore.currentCount}/{$gameElementStore.maxCount}
  </div>
</div>

<ButtonGroup />

<style lang="scss">
  // TODO
  $main-color: #0e3c79;

  $flame-height: 150px;
  $wick-height: 50px;
  $orange: #ff6a00;
  $orange-yellow: #ff9224;
  $dark: #2c2b39;
  $blue-dark: #30537d;
  $blue-light: #76daff;
  $yellow: #fbf348;
  $yellow-grey: #58523a;

  .candle {
    z-index: 10;
    width: 34px;
    //margin: 30px auto 0 auto;
    bottom: 50px;
    position: absolute;
    //height: 80%;
    //align-self: flex-end;
    animation: blink 0.1s infinite;
  }

  .candle-unlit {
    bottom: 50px;
    z-index: 100;
    width: 34px;
    //margin: 30px auto 0 auto;
    position: absolute;
    //height: 80%;
    //align-self: flex-end;
  }
  .wick {
    position: absolute;
    width: 6px;
    height: $wick-height;
    background: #23161a;
    top: $flame-height - 0.8 * $wick-height;
    left: 50%;
    transform: translateX(-50%) skewX(2deg);
    border-radius: 10%;
    box-shadow: 0 0 2px 0px black;
    &:before {
      content: '';
      position: absolute;
      width: 0;
      left: 50%;
      height: 10px;
      box-shadow: 0 -14px 10px 8px white,
        0 -10px 10px 8px rgba(255, 215, 0, 0.7),
        //gold
        0 -3px 10px 8px rgba(255, 106, 0, 0.7),
        //orange
        0 6px 3px 4px black;
    }
    &:after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 0;
      width: 0px;
      height: 0px;
      box-shadow: 0 5px 2px 3px gold, 0 20px 2px 14px gold,
        0 -6px 4px 5px rgba(98, 33, 27, 0.8),
        //dark orange
        0 0px 1px 4px rgba(255, 106, 0, 0.7),
        //orange
        0 0px 3px 4px $orange,
        0 5px 3px 4px gold;
    }
  }

  .wick-unlit {
    position: absolute;
    width: 6px;
    height: $wick-height;
    background: #23161a;
    top: $flame-height - 0.8 * $wick-height;
    left: 50%;
    transform: translateX(-50%) skewX(2deg);
    border-radius: 10%;
    box-shadow: 0 0 2px 0px black;
    &:before {
      content: '';
      position: absolute;
      width: 0;
      left: 50%;
      height: 10px;
    }
    &:after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 0;
      width: 0px;
      height: 0px;
    }
  }

  .flame {
    width: 20px;
    height: $flame-height;
    margin: 0px auto;
    position: relative;
    animation: move 3s infinite, move-left 3s infinite;
    transform-origin: 50% 90%;
    .top {
      width: 20px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background: white;
      border-top-left-radius: 500%;
      border-bottom-left-radius: 50px;
      border-top-right-radius: 500%;
      border-bottom-right-radius: 50px;
      transform: skewY(-10deg);
      box-shadow: 0 0px 0px 3px white, 0 -20px 1px 4px white,
        0 -25px 2px 3px gold, 0 -30px 5px 4px $orange,
        //top
        0 0px 150px 10px $orange,
        //global
        0 -10px 2px 4px white,
        0 -5px 3px 3px white;
      animation: flame-up 4s infinite;
    }
    .shadows {
      position: absolute;
      left: 50%;
      top: 0;
      width: 1px;
      height: 60px;
      border-radius: 50%;
      box-shadow: 0 5px 20px 15px gold, 0 0px 100px 20px $orange,
        0 15px 50px 15px $orange, 5px 30px 5px 13px $orange,
        5px 50px 5px 13px $orange, 0 75px 50px 30px black;
    }
    .bottom {
      transform: scale(0.9);
      position: absolute;
      bottom: 6px;
      left: 9px;
      width: 1px;
      height: 8px;
      border-radius: 1%;
      background: $dark;
      box-shadow: 0 6px 10px 12px rgba(60, 76, 125, 0.3),
        //dark blue
        0 0px 4px 8px $dark,
        0 -12px 10px 8px rgba(255, 106, 0, 0.5),
        //orange
        0 5px 7px 12px $dark,
        0 -3px 10px 12px $dark, 5px -10px 10px 5px red, 0 -15px 10px 10px gold,
        5px -25px 10px 5px gold, 0 2px 5px 10px $blue-dark,
        0 -2px 2px 14px $blue-light, 0 2px 10px 12px $blue-light;
    }
  }
  .wax {
    position: relative;
    top: 15px;
    width: 100%;
    height: 50px;
    background: $orange-yellow;
    background: -moz-linear-gradient(
      top,
      $orange-yellow 0px,
      $orange-yellow 20px,
      $yellow-grey 50px
    ); /* FF3.6-15 */
    background: -webkit-linear-gradient(
      top,
      $orange-yellow 0px,
      $orange-yellow 20px,
      $yellow-grey 50px
    ); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(
      to bottom,
      $orange-yellow 0px,
      $orange-yellow 20px,
      $yellow-grey 50px
    ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    //filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ff9224', endColorstr='#58523a',GradientType=0 ); /* IE6-9 */

    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    box-shadow: inset 0 7px 12px -2px $yellow,
      inset 0 9px 57px -3px rgba(255, 0, 0, 0.4), inset 0 -5px 8px 2px black,
      0 0 3px 0px $orange;
  }

  @keyframes move {
    0% {
      transform: skewX(2deg) skewY(5deg);
    }
    50% {
      transform: skewX(-2deg) skewY(-0deg);
    }
    100% {
      transform: skewX(2deg) skewY(5deg);
    }
  }
  @keyframes move-left {
    50% {
      transform: skewX(3deg);
    }
  }
  @keyframes flame-up {
    50% {
      box-shadow: 0 0px 0px 3px white, 0 -38px 1px 2px white,
        0 -41px 2px 3px gold, 0 -50px 5px 4px $orange,
        //orange top
        0 0px 150px 10px $orange,
        //orange global
        0 -10px 2px 4px white,
        0 -5px 3px 3px white;
    }
  }
  @keyframes blink {
    50% {
      opacity: 0.95;
    }
  }
</style>
