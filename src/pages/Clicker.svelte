<script lang="ts">
  import { gameElementStore, inputButtonsVisible } from '../store';
  import { onDestroy, onMount } from 'svelte';
  import { SupabaseObject } from '../db';

  let onCooldown = false;
  let width = 0;

  let income = 1;
  let money = 0;
  let speed = 1;

  let autobuying = false;
  let gameStarted = false;
  let upgradesUnlocked = false;

  let interval;

  interface Upgrade {
    text: string;
    mlt?: number;
    callback: Function;
    price: number;
  }

  let upgrades = [
    {
      text: 'Multiply income by 3',
      mlt: 3,
      callback: increaseIncome,
      price: 10,
    },
    {
      text: 'Multiply income by 2',
      mlt: 2,
      callback: increaseIncome,
      price: 30,
    },
    {
      text: 'Multiply speed by 2',
      mlt: 2,
      callback: increaseSpeed,
      price: 50,
    },
    {
      text: 'Autoclicker',
      callback: setAutobuyer,
      price: 100,
    },
    {
      text: 'Multiply income by 3',
      mlt: 3,
      callback: increaseIncome,
      price: 200,
    },
    {
      text: 'Multiply income by 3',
      mlt: 3,
      callback: increaseIncome,
      price: 500,
    },
    {
      text: 'Multiply speed by 2',
      mlt: 2,
      callback: increaseSpeed,
      price: 1000,
    },
    {
      text: 'Multiply income by 3',
      mlt: 3,
      callback: increaseIncome,
      price: 5000,
    },
    {
      text: 'Multiply speed by 3',
      mlt: 3,
      callback: increaseSpeed,
      price: 10000,
    },
    {
      text: 'Multiply income by 3',
      mlt: 3,
      callback: increaseIncome,
      price: 20000,
    },
    {
      text: 'Multiply income by 10',
      mlt: 10,
      callback: increaseIncome,
      price: 100000,
    },
    {
      text: 'BUY CONFIRM BUTTON',
      callback: buyConfirmButton,
      price: 1000000,
    },
  ];

  function increaseIncome(mlt) {
    income *= mlt;
  }

  function increaseSpeed(speedMlt) {
    speed *= speedMlt;
  }

  function setAutobuyer() {
    autobuying = true;
    startCooldown();
  }

  function buyConfirmButton() {
    $gameElementStore.currentCount++;
    SupabaseObject.setGameElementCount($gameElementStore);
  }

  function buyUpgrade(upgrade: Upgrade) {
    if (money < upgrade.price) {
      return;
    }
    upgrades = upgrades.filter(
      (e) => !(e.text === upgrade.text && e.price === upgrade.price)
    );
    money -= upgrade.price;
    upgrade.callback(upgrade.mlt);
  }

  onMount(() => {
    interval = setInterval(() => {
      if (onCooldown) {
        width = width + speed;
        if (width > 100) {
          onCooldown = false;
          width = 0;
          money += income;
          if (upgrades.length > 0 && money >= upgrades[0].price) {
            upgradesUnlocked = true;
          }
          if (autobuying) {
            startCooldown();
          }
        }
      }
    }, 16);
  });

  onDestroy(() => {
    clearInterval(interval);
    inputButtonsVisible.set(false);
  });

  function startCooldown() {
    if (onCooldown) {
      return;
    }
    gameStarted = true;
    onCooldown = true;
  }
</script>

{#if gameStarted}
  money: {money.toLocaleString()}$
{/if}
<div
  on:click="{() => {
    if (!autobuying) startCooldown();
  }}"
  class="progress-container"
>
  <div class="text-of-day">
    MeepMorps <br />
    {#if gameStarted}
      Generate {income}$
    {:else}
      0/1
    {/if}
  </div>
  <div class="progress-bar" style="width: {width}%"></div>
</div>

{#if upgradesUnlocked}
  Upgrades:
  <hr />
  {#each upgrades.slice(0, 2) as upgrade}
    <div
      on:click="{() => {
        buyUpgrade(upgrade);
      }}"
      class="progress-container"
      style="{money >= upgrade.price ? 'background-color: #137a16' : ''}"
    >
      <div class="text-of-day">
        {upgrade.text}
        <br />
        Costs: <i>{upgrade.price.toLocaleString()}$</i>
      </div>
    </div>
  {/each}
{/if}

<style lang="scss">
  .progress-bar {
    transition: unset;
  }
</style>
