<script lang="ts">
  import { supabaseClient } from './db';
  supabaseClient.signUp().then((a) => {
    console.log(a);
  });

  let maxCount = 1;
  let counter = 0;

  function increment() {
    if (counter < maxCount) counter++;
  }

  function decrement() {
    if (counter > 0) counter--;
  }
</script>

<main>
  <h1>The adventures of Sti</h1>
  <input type="hidden">
</main>

<style lang="scss">
  $main-color: #0e3c79;

  main {
    text-align: center;
    max-width: 240px;
    margin: 0 auto;
  }

  .progress-container {
    overflow: hidden;
    border-radius: 5px;
    height: 30px;
    width: 100%;
    background-color: #b91f1f;
    .progress-bar {
      height: 100%;
      width: 50%;
      background-color: $main-color;
      transition: 0.3s all;
    }
  }

  .button-container {
    margin-top: 15px;
    .change-button {
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

  h1 {
    font-size: 3em;
    color: #505050;
    text-transform: uppercase;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
