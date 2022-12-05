<script lang="ts">
  import { gameElementStore, inputButtonsVisible } from "../store";
  import { onDestroy, onMount } from "svelte";
  import ProgressBar from "../components/ProgressBar.svelte";
  import ButtonGroup from "../components/ButtonGroup.svelte";
  import "@interactjs/auto-start";
  import "@interactjs/actions/drag";
  import "@interactjs/actions/resize";
  import "@interactjs/modifiers";
  import "@interactjs/dev-tools";
  import interact from "@interactjs/interact";

  let curDraggable = null;

  let dx = 0;
  let dy = 0;

  let x = 0;
  let y = 0;

  let interval;

  onMount(() => {
    inputButtonsVisible.set(true);

    interact(".draggable").draggable({
      // enable inertial throwing
      inertia: true,

      // enable autoScroll
      autoScroll: true,

      listeners: {
        // call this function on every dragmove event
        move: dragMoveListener,
        start: (event) => {
          curDraggable = event.target;
          clearInterval(interval);
        },

        // call this function on every dragend event
        end: (event) => {
          dx = event.velocity.x;
          dy = event.velocity.y;
        },
      },
    });
    function dragMoveListener(event) {
      var target = event.target;
      // keep the dragged position in the data-x/data-y attributes
      var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
      var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

      // translate the element
      target.style.transform = "translate(" + x + "px, " + y + "px)";

      // update the posiion attributes
      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    }

    // // Mouse Up Event
    function upEvent(event) {
      clearInterval(interval);
      interval = setInterval(() => {
        const x =
          (parseFloat(curDraggable.getAttribute("data-x")) || 0) + dx / 100;
        const y =
          (parseFloat(curDraggable.getAttribute("data-y")) || 0) + dy / 100;

        // translate the element
        curDraggable.style.transform = "translate(" + x + "px, " + y + "px)";
        curDraggable.setAttribute("data-x", x);
        curDraggable.setAttribute("data-y", y);

        if (
          curDraggable.getBoundingClientRect().left < 0 ||
          curDraggable.getBoundingClientRect().right >
            document.body.clientWidth ||
          curDraggable.getBoundingClientRect().top < 0 ||
          curDraggable.getBoundingClientRect().bottom >
            document.body.clientHeight
        ) {
          clearInterval(interval);
          curDraggable.style.visibility = "hidden";
        }
      }, 16);
    }
    window.addEventListener("mouseup", upEvent);
    window.addEventListener("touchend", upEvent);
  });

  onDestroy(() => {
    inputButtonsVisible.set(false);
  });
</script>


{#each Array(500).fill(null) as _, i}
  <div
    class="draggable"
    style="left: {Math.random() * 90}%; top: {Math.random() * 90}%"
  />
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
    background-image: url("/snowball.png");
    background-size: contain;
    //background: #424242;
    cursor: pointer;
    position: absolute;
    color: $main-color;
    width: 50px;
    height: 50px;
    font-size: 30px;
    z-index: 100;
    touch-action: none;
    user-select: none;
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
