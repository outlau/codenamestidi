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

  let xVelocityMlt = 2;
  let yVelocityMlt = 2;

  let plusPosX = '0px';
  let plusPosY = '0px';

  let letters: Array<
    Array<{
      letter: string;
      id: number;
      selected?: boolean;
      completed?: boolean;
    }>
  > = [
    [
      { letter: 'T', id: 1 },
      { letter: 'H', id: 2 },
      { letter: 'E', id: 3 },
    ],
    [
      { letter: 'A', id: 4 },
      { letter: 'D', id: 5 },
      { letter: 'V', id: 6 },
      { letter: 'E', id: 7 },
      { letter: 'N', id: 8 },
      { letter: 'T', id: 9 },
      { letter: 'U', id: 10 },
      { letter: 'R', id: 11 },
      { letter: 'E', id: 12 },

      { letter: 'O', id: 13 },
      { letter: 'F', id: 14 },
    ],
    [
      { letter: 'S', id: 15 },
      { letter: 'T', id: 16 },
      { letter: 'I', id: 17 },
    ],
  ];

  function setLetterInterval(
    targetElement,
    letter: { letter: string; id: number }
  ) {
    clearInterval(interval);
    const placeholderElements = document.getElementsByClassName(
      `${letter.letter.toLowerCase()}-letter`
    );

    console.log(placeholderElements);
    const targets = [...placeholderElements].filter((el: HTMLElement) => {
      return ![...el.classList].some((e) => e === 'letter-done');
    });
    console.log(targets);
    interval = setInterval(() => {
      // console.log(man.style.left);
      // const boundingRectTarget = target.getBoundingClientRect();
      // const boundingRectPlus = plus.getBoundingClientRect();

      targetElement.style.left = `${
        Number(targetElement.style.left.split('px')[0]) +
        xVelocity * xVelocityMlt
      }px`;
      targetElement.style.top = `${
        Number(targetElement.style.top.split('px')[0]) +
        yVelocity * yVelocityMlt
      }px`;

      if (success) {
        return;
      }

      // console.log({ offsetLeft, offsetTop });
      // console.log({ left: boundingRectPlus.left, top: boundingRectPlus.top });

      targets.find((target: HTMLElement) => {
        const boundingRectTarget = target.getBoundingClientRect();
        if (
          between(
            Number(targetElement.style.left.split('px')[0]) - 5,
            boundingRectTarget.left - 2,
            boundingRectTarget.left + 2
          ) &&
          between(
            Number(targetElement.style.top.split('px')[0]) - 3,
            boundingRectTarget.top - 2,
            boundingRectTarget.top + 2
          )
        ) {
          console.log('success');
          target.classList.add('letter-done');
          target.style.backgroundColor = 'green';
          target.style.color = 'black';
          targetElement.style.display = 'none';
          clearInterval(interval);
          letters = letters.map((row) =>
            row.map((l) => {
              if (l.id === letter.id) {
                return { ...l, completed: true };
              }
              return l;
            })
          );
          // check if all letters are completed
          const allCompleted = letters.every((row) =>
            row.every((l) => l.completed)
          );
          if(allCompleted){
            inputButtonsVisible.set(true);
            console.log('succes');
          }
          return true;
        }
        return false;
      });

      // if (
      //   between(boundingRectPlus.left - 14, offsetLeft - 2, offsetLeft + 2) &&
      //   between(boundingRectPlus.top - 15, offsetTop - 2, offsetTop + 2)
      // ) {
      //   success = true;
      // } else {
      //   success = false;
      // }

      // if (
      //   boundingRectMan.left <= boundingRectPlus.right &&
      //   boundingRectMan.right >= boundingRectPlus.right &&
      //   boundingRectMan.top <= boundingRectPlus.bottom &&
      //   boundingRectMan.bottom >= boundingRectPlus.top
      // ) {
      //   // Hit left side
      //   plus.style.left = `${
      //     Number(plus.style.left.split('px')[0]) + -1 * xVelocityMlt
      //   }px`;
      //   return;
      // }
      // if (
      //   boundingRectMan.left <= boundingRectPlus.left &&
      //   boundingRectMan.right >= boundingRectPlus.left &&
      //   boundingRectMan.top <= boundingRectPlus.bottom &&
      //   boundingRectMan.bottom >= boundingRectPlus.top
      // ) {
      //   // Hit right side
      //   plus.style.left = `${
      //     Number(plus.style.left.split('px')[0]) + 1 * xVelocityMlt
      //   }px`;
      //   return;
      // }
      //
      // if (
      //   boundingRectMan.left <= boundingRectPlus.right &&
      //   boundingRectMan.right >= boundingRectPlus.left &&
      //   boundingRectMan.top <= boundingRectPlus.top &&
      //   boundingRectMan.bottom >= boundingRectPlus.top
      // ) {
      //   // Hit bottom side
      //   plus.style.top = `${
      //     Number(plus.style.top.split('px')[0]) + 1 * yVelocityMlt
      //   }px`;
      //   return;
      // }
      //
      // if (
      //   boundingRectMan.left <= boundingRectPlus.right &&
      //   boundingRectMan.right >= boundingRectPlus.left &&
      //   boundingRectMan.top <= boundingRectPlus.bottom &&
      //   boundingRectMan.bottom >= boundingRectPlus.bottom
      // ) {
      //   // Hit top side
      //   plus.style.top = `${
      //     Number(plus.style.top.split('px')[0]) + -1 * yVelocityMlt
      //   }px`;
      //   return;
      // }
    }, 16.666666666666668);
  }

  onMount(() => {
    inputButtonsVisible.set(false);

    const lettersContainer = document.getElementById('letters-container');

    lettersContainer.childNodes.forEach((child) => {
      child.childNodes.forEach((letter) => {
        // @ts-ignore
        if (letter.style) {
          // @ts-ignore
          letter.style.left = `${
            Math.random() * window.innerWidth * 0.9 + 20
          }px`;
          // @ts-ignore
          letter.style.top = `${
            Math.random() * window.innerHeight * 0.9 + 20
          }px`;
        }
      });
    });
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

  function selectLetter(letter: { letter: string; id: number }, event: any) {
    letters = letters.map((row) =>
      row.map((l) => ({ ...l, selected: l.id === letter.id }))
    );
    setLetterInterval(event.target, letter);
  }

  onDestroy(() => {
    inputButtonsVisible.set(false);
    clearInterval(interval);
  });
</script>

<div id="title-container">
  <div class="letter-placeholder-group">
    <div class="letter-placeholder t-letter">t</div>
    <div class="letter-placeholder h-letter">h</div>
    <div class="letter-placeholder e-letter">e</div>
  </div>
  <div class="letter-placeholder-group">
    <div class="letter-placeholder a-letter">a</div>
    <div class="letter-placeholder d-letter">d</div>
    <div class="letter-placeholder v-letter">v</div>
    <div class="letter-placeholder e-letter">e</div>
    <div class="letter-placeholder n-letter">n</div>
    <div class="letter-placeholder t-letter">t</div>
    <div class="letter-placeholder u-letter">u</div>
    <div class="letter-placeholder r-letter">r</div>
    <div class="letter-placeholder e-letter">e</div>
    <div class="letter-placeholder s-letter">s</div>

    <div class="letter-placeholder"></div>

    <div class="letter-placeholder o-letter">o</div>
    <div class="letter-placeholder f-letter">f</div>
  </div>
  <div class="letter-placeholder-group">
    <div class="letter-placeholder s-letter">s</div>
    <div class="letter-placeholder t-letter">t</div>
    <div class="letter-placeholder i-letter">i</div>
  </div>
</div>

<div id="letters-container">
  {#each letters as letter}
    <div class="letter-group">
      {#each letter as l}
        {#if l.letter}
          <div
            class="letter"
            class:selected-letter="{l.selected}"
            on:click="{(event) => selectLetter(l, event)}"
          >
            {l.letter}
          </div>
        {/if}
      {/each}
    </div>
  {/each}
</div>
<ProgressBar />

<ButtonGroup />

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

  .bottom-container {
    position: absolute;
    bottom: 0;
    margin: auto;
    display: flex;
    width: 100%;
    left: 0;
    justify-content: space-around;
  }

  .arrow {
    font-size: 50px;
  }

  .selected-letter {
    outline: 2px solid $main-color;
  }

  .letter {
    position: absolute;
    z-index: 10;
  }

  #title-container {
    font-size: 2em;
    text-transform: uppercase;
    font-weight: 100;
    line-height: 1.2;
    margin-bottom: 50px;
    position: absolute;
    top: 50px;
    height: 115px;
    width: 100%;
    color: transparent;

    .letter-placeholder-group {
      width: 100%;
      height: 41px;
      display: flex;
      justify-content: center;

      .letter-placeholder {
        width: 20px;
        height: 30px;
        background: rgba(204, 204, 204, 0.85);
        border: 1px solid rgba(0, 0, 0, 0.2);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
