<script lang="ts">
  import { onMount } from 'svelte';
  import { Link, Route, Router, navigate } from 'svelte-navigator';
  import {
    Divider,
    Icon,
    List,
    ListItem,
    MaterialApp,
    NavigationDrawer,
  } from 'svelte-materialify';
  import { mdiFormatListBulleted, mdiHelp, mdiHome, mdiMenu } from '@mdi/js';
  import { Fireworks } from 'fireworks-js';

  import { gameElementStore } from './store';

  import { SupabaseObject } from './db';
  import Home from './pages/Home.svelte';
  import PuzzleCountdown from './pages/PuzzleCountdown.svelte';
  import CompletedList from './pages/CompletedList.svelte';
  import { GameType } from './interfaces/game-type';
  import SecretItem from './pages/SecretItem.svelte';
  import SignIn from './pages/SignIn.svelte';
  import Admin from './pages/Admin.svelte';

  let finishedGame = false;

  async function setGameElement() {
    const gameElement = await SupabaseObject.getGameElement();
    console.log(gameElement);
    if (!gameElement || (gameElement.id === 30 && gameElement.approved)) {
      finishedGame = true;
      setTimeout(() => {
        const container = document.querySelector('.fireworks-container');
        const fireworks = new Fireworks(container, {
          /* options */
        });
        fireworks.setOptions({ delay: { min: 10, max: 15 } });

        fireworks.start();
      }, 100);
      return false;
    }
    gameElementStore.set(gameElement);
    if (
      gameElement.attributes &&
      gameElement.attributes.type === GameType.hacker
    ) {
      const mainContainer = document.getElementsByClassName('s-app')[0];
      mainContainer.style.background = 'url(images/matrix.png)';
    }
    return true;
  }

  onMount(async () => {
    const session = SupabaseObject.supabase.auth.session();
    if (!session) {
      return navigate('/sign-in', { replace: true });
    }
    if (window.location.pathname.includes('list/')) {
      // Oooooff ouch
      const id = window.location.pathname.split('/').filter((e) => e)[1];
      const gameElement = await SupabaseObject.getGameElementById(Number(id));
      if (!gameElement) {
        throw new Error('No game element found for id ' + id);
      }
      gameElementStore.set(gameElement);
      return;
    }
    const ret = await setGameElement();
    if (!ret) {
      return;
    }
    setInterval(async () => {
      let tempGameElement = await SupabaseObject.getGameElement();
      if (
        tempGameElement.id !== $gameElementStore.id ||
        tempGameElement.approved !== $gameElementStore.approved ||
        tempGameElement.completed !== $gameElementStore.completed
      ) {
        gameElementStore.set(tempGameElement);
        if (
          tempGameElement.attributes &&
          tempGameElement.attributes.type === GameType.hacker
        ) {
          const mainContainer = document.getElementsByClassName('s-app')[0];
          mainContainer.style.background = 'url(images/matrix.png)';
        }
        return;
      }
    }, 1000);
  });

  let menuOpen = false;
</script>

<Router primary="{false}">
  <div id="parent-container">
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
            {#if $gameElementStore && $gameElementStore.attributes && $gameElementStore.attributes.type === GameType.secretMenuItem}
              <ListItem>
                <Link to="verysecretlink"><Icon path="{mdiHelp}" /></Link>
              </ListItem>
            {/if}
          </List>
        </NavigationDrawer>
      </div>

      <main
        style="{$gameElementStore &&
        $gameElementStore.attributes &&
        $gameElementStore.attributes.type === GameType.hacker
          ? 'background-image:https://media.istockphoto.com/photos/matrix-picture-id629391430'
          : ''}"
      >
        <Route path="">
          <h1>The adventures of Sti</h1>
          {#if finishedGame}
            Congratulations you have successfully completed the Adventures of
            Sti. Please contact the overlord to receive your final prize if you
            haven't already.

            <div class="fireworks-container"></div>

            <div class="finished-text">YOU DID IT</div>
          {:else if $gameElementStore}
            {#if !$gameElementStore.completed && !$gameElementStore.approved}
              <div style="margin-bottom:15px; font-style:italic">
                Event number: {$gameElementStore.id}
              </div>
              <Home />
            {:else if $gameElementStore.completed && !$gameElementStore.approved}
              <div class="info-text">
                Waiting for approval from the overlord
              </div>
              <div class="snippet" data-title=".dot-bricks">
                <div class="stage">
                  <div class="dot-bricks"></div>
                </div>
              </div>
            {:else if $gameElementStore.completed && $gameElementStore.approved}
              <PuzzleCountdown />
            {/if}
          {:else}
            <div class="info-text">Fetching...</div>
          {/if}
        </Route>
        <Route path="list">
          <CompletedList />
        </Route>
        <Route path="verysecretlink">
          <SecretItem />
        </Route>
        <Route path="stidi">
          <SecretItem />
        </Route>
        <Route path="sign-in">
          <SignIn signingUp="{false}" />
        </Route>
        <Route path="sign-up">
          <SignIn signingUp="{true}" />
        </Route>
        <Route path="admin">
          <Admin />
        </Route>
        <Route path="list/:id">
          <h1>The adventures of Sti</h1>
          {#if $gameElementStore}
            <Home />
          {:else}
            Fetching...
          {/if}
        </Route>
      </main>
    </MaterialApp>
  </div>
</Router>

<style lang="scss">
  $main-color: #0e3c79;

  #parent-container {
    width: 100%;
    height: 100%;
  }
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
    padding: 50px 10px;
    text-align: center;
    max-width: 240px;
    margin: 0 auto;
    font-weight: 300;
    background: white;
  }

  .fireworks-container {
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
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

  .finished-text {
    color: black;

    width: 420px;
    height: 250px;

    font-family: 'Oswald', sans-serif;
    font-size: 9em;
    line-height: 1;
    margin: 0;
    padding: 0;

    -webkit-transform: rotateX(25deg) rotateY(20deg) rotateZ(-3deg);
    transform: rotateX(25deg) rotateY(20deg) rotateZ(-3deg);

    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -180px;

    -webkit-animation: anim 3s;
    -webkit-animation-timing-function: linear;
    -webkit-animation-iteration-count: infinite;

    animation: anim 3s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @-webkit-keyframes anim {
    0% {
      text-shadow: -6px 4px 0px red;
    }
    10% {
      text-shadow: 4px -6px 0px green;
    }
    20% {
      text-shadow: -9px 4px 0px blue;
    }
    30% {
      text-shadow: 4px -6px 0px yellow;
    }
    40% {
      text-shadow: -8px 4px 0px orange;
    }
    50% {
      text-shadow: 4px 5px 0px purple;
    }
    60% {
      text-shadow: -6px 4px 0px brown;
    }
    70% {
      text-shadow: 4px 7px 0px pink;
    }
    80% {
      text-shadow: -9px -4px 0px lime;
    }
    90% {
      text-shadow: 4px -6px 0px cyan;
    }
    100% {
      text-shadow: -9px 4px 0px teal;
    }
  }

  @keyframes anim {
    0% {
      text-shadow: -6px 4px 0px red;
    }
    10% {
      text-shadow: 4px -6px 0px green;
    }
    20% {
      text-shadow: -9px 4px 0px blue;
    }
    30% {
      text-shadow: 4px -6px 0px yellow;
    }
    40% {
      text-shadow: -8px 4px 0px orange;
    }
    50% {
      text-shadow: 4px 5px 0px purple;
    }
    60% {
      text-shadow: -6px 4px 0px brown;
    }
    70% {
      text-shadow: 4px 7px 0px pink;
    }
    80% {
      text-shadow: -9px -4px 0px lime;
    }
    90% {
      text-shadow: 4px -6px 0px cyan;
    }
    100% {
      text-shadow: -9px 4px 0px teal;
    }
  }
</style>
