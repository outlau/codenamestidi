<script lang="ts">
  import { onMount } from 'svelte';
  import { Router, Route, Link } from 'svelte-navigator';
  import {
    MaterialApp,
    NavigationDrawer,
    List,
    ListItem,
    Avatar,
    Divider,
    Icon,
  } from 'svelte-materialify';
  import {
    mdiHome,
    mdiFormatListBulleted,
    mdiAccount,
    mdiAccountGroup,
    mdiMenu,
    mdiHamburger,
  } from '@mdi/js';

  import { completed } from './store';

  import { SupabaseObject } from './db';
  import type { GameElement } from './game-element';
  import Game from './components/Game.svelte';
  import Countdown from './components/Countdown.svelte';
  import CompletedList from './components/CompletedList.svelte';
  import Gyro from './components/Gyro.svelte';

  let gameElement: GameElement;

  enum CurrentLocation {
    Home = 'home',
    List = 'list',
  }

  let currentLocation: CurrentLocation = CurrentLocation.Home;

  async function setGameElement() {
    gameElement = await SupabaseObject.getGameElement();
    completed.set(gameElement.completed);
  }
  onMount(async () => {
    await SupabaseObject.signIn('la-bobtheko@hotmail.com', '1234qwer');
    const session = SupabaseObject.supabase.auth.session();
    console.log(session);
    await setGameElement();
    setInterval(async () => {
      let tempGameElement = await SupabaseObject.getGameElement();
      if (
        tempGameElement.id !== gameElement.id ||
        tempGameElement.approved !== gameElement.approved ||
        tempGameElement.completed !== gameElement.completed
      ) {
        gameElement = tempGameElement;
        completed.set(gameElement.completed);
        return;
      }
    }, 1000);
  });

  let menuOpen = false;
</script>

<Router primary="{false}">
  <MaterialApp>
    <button
      on:click="{() => {
        menuOpen = !menuOpen;
      }}"
      class="hamburger-menu"
    >
      <Icon path="{mdiMenu}" />
    </button>
    <div class="navdrawer" style="left:{menuOpen ? '0' : '-60px'}">
      <NavigationDrawer mini="{true}">
        <ListItem>
          <span slot="prepend">
            <button
              on:click="{() => {
                menuOpen = !menuOpen;
              }}"
              class="nav-hamburger-menu"
            >
              <Icon path="{mdiMenu}" />
            </button>
          </span>
        </ListItem>
        <Divider />
        <List dense nav>
          <ListItem>
            <Link to="/"><Icon path="{mdiHome}" /></Link>
          </ListItem>
          <ListItem>
            <Link to="list"><Icon path="{mdiFormatListBulleted}" /></Link>
          </ListItem>
          <ListItem>
            <span slot="prepend">
              <Icon path="{mdiAccountGroup}" />
            </span>
          </ListItem>
        </List>
      </NavigationDrawer>
    </div>

    <main>
      <Route path="">
        <h1>The adventures of Sti</h1>

        {#if gameElement}
          {#if !$completed && !gameElement.approved}
            <Game gameElement="{gameElement}" />
          {:else if $completed && !gameElement.approved}
            <div class="info-text">Waiting for approval from the overlord</div>
            <div class="snippet" data-title=".dot-bricks">
              <div class="stage">
                <div class="dot-bricks"></div>
              </div>
            </div>
          {:else if $completed && gameElement.approved}
            <Countdown style="margin: 50px" gameElement="{gameElement}" />
          {/if}
        {:else}
          <div class="info-text">Fetching...</div>
        {/if}
      </Route>
      <Route path="list">
        <CompletedList />
      </Route>
    </main>
  </MaterialApp>
</Router>

<style lang="scss">
  $main-color: #0e3c79;
  .navdrawer {
    position: absolute;
    height: 100%;
    transition: 0.3s all;
    box-shadow: rgb(102 102 102) 0 0 1px 0.2px;
    z-index: 10;
    .nav-hamburger-menu {
    }
  }
  .hamburger-menu {
    position: absolute;
    top: 15px;
    left: 16px;
  }
  main {
    padding-top: 50px;
    text-align: center;
    max-width: 240px;
    margin: 0 auto;
    font-weight: 300;
  }

  .snippet {
    text-align: center;
    left: calc(50% - 5px);
    position: absolute;
    margin-top: 20px;
    .dot-bricks {
      position: relative;
      top: 8px;
      left: -9999px;
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background-color: #9880ff;
      color: #9880ff;
      box-shadow: 9991px -16px 0 0 #9880ff, 9991px 0 0 0 #9880ff,
        10007px 0 0 0 #9880ff;
      animation: dotBricks 2s infinite ease;
    }

    @keyframes dotBricks {
      0% {
        box-shadow: 9991px -16px 0 0 #9880ff, 9991px 0 0 0 #9880ff,
          10007px 0 0 0 #9880ff;
      }
      8.333% {
        box-shadow: 10007px -16px 0 0 #9880ff, 9991px 0 0 0 #9880ff,
          10007px 0 0 0 #9880ff;
      }
      16.667% {
        box-shadow: 10007px -16px 0 0 #9880ff, 9991px -16px 0 0 #9880ff,
          10007px 0 0 0 #9880ff;
      }
      25% {
        box-shadow: 10007px -16px 0 0 #9880ff, 9991px -16px 0 0 #9880ff,
          9991px 0 0 0 #9880ff;
      }
      33.333% {
        box-shadow: 10007px 0 0 0 #9880ff, 9991px -16px 0 0 #9880ff,
          9991px 0 0 0 #9880ff;
      }
      41.667% {
        box-shadow: 10007px 0 0 0 #9880ff, 10007px -16px 0 0 #9880ff,
          9991px 0 0 0 #9880ff;
      }
      50% {
        box-shadow: 10007px 0 0 0 #9880ff, 10007px -16px 0 0 #9880ff,
          9991px -16px 0 0 #9880ff;
      }
      58.333% {
        box-shadow: 9991px 0 0 0 #9880ff, 10007px -16px 0 0 #9880ff,
          9991px -16px 0 0 #9880ff;
      }
      66.666% {
        box-shadow: 9991px 0 0 0 #9880ff, 10007px 0 0 0 #9880ff,
          9991px -16px 0 0 #9880ff;
      }
      75% {
        box-shadow: 9991px 0 0 0 #9880ff, 10007px 0 0 0 #9880ff,
          10007px -16px 0 0 #9880ff;
      }
      83.333% {
        box-shadow: 9991px -16px 0 0 #9880ff, 10007px 0 0 0 #9880ff,
          10007px -16px 0 0 #9880ff;
      }
      91.667% {
        box-shadow: 9991px -16px 0 0 #9880ff, 9991px 0 0 0 #9880ff,
          10007px -16px 0 0 #9880ff;
      }
      100% {
        box-shadow: 9991px -16px 0 0 #9880ff, 9991px 0 0 0 #9880ff,
          10007px 0 0 0 #9880ff;
      }
    }
  }

  h1 {
    font-size: 2em;
    color: #505050;
    text-transform: uppercase;
    font-weight: 100;
    line-height: 1.2;
    margin-bottom: 50px;
  }

  @media (min-width: 640px) {
    main {
      max-width: 500px;
    }
  }
</style>
