<script lang="ts">
  import { onMount } from 'svelte';

  import { SupabaseObject } from '../db';
  import { Button, Checkbox, TextField } from 'svelte-materialify';
  import { Link, navigate } from 'svelte-navigator';

  export let signingUp;

  onMount(() => {
    const session = SupabaseObject.supabase.auth.session();
    if (session) {
      navigate('/', { replace: true });
    }
  });

  function inputEmail(e) {
    email = e.target.value;
  }

  function inputPassword(e) {
    password = e.target.value;
  }

  function inputVerifyPassword(e) {
    verifyPassword = e.target.value;
    if (verifyPassword !== password) {
      errorMessage = errorMessageText;
    } else {
      errorMessage = '';
    }
  }

  let signUpErrorMessage = '';

  async function signUp() {
    const signUpRet = await SupabaseObject.signUp(email, password);
    console.log(signUpRet);
    if (signUpRet.error) {
      signUpErrorMessage = signUpRet.error.message;
      return;
    }
    navigate('/sign-in', { replace: true });
  }

  async function signIn() {
    const signUpRet = await SupabaseObject.signIn(email, password);
    console.log(signUpRet);
    if (signUpRet.error) {
      signUpErrorMessage = signUpRet.error.message;
      return;
    }
    window.location.href = '/';
  }

  function check() {
    signUpToNews = !signUpToNews;
  }
  let signUpToNews = false;
  let email = '';
  let password = '';
  let verifyPassword = '';
  let errorMessage = '';
  const errorMessageText = 'Passwords must match';
</script>

Sign in!
<br />
<TextField outlined on:input="{inputEmail}">Email</TextField>
<TextField outlined type="password" on:input="{inputPassword}">
  Password
</TextField>
{#if signingUp}
  <TextField
    outlined
    type="password"
    on:input="{inputVerifyPassword}"
    messages="{errorMessage}"
    error="{!!errorMessage}"
  >
    Verify password
  </TextField>

  <div class="checkbox-container">
    <Checkbox on:change="{check}" value="1">
      {signUpToNews
        ? "Nah I'm just kidding lol"
        : 'Sign me up for the monthly news letter'}
    </Checkbox>
  </div>
  <div class="button-container">
    <Button
      on:click="{signUp}"
      disabled="{!(email && password && password === verifyPassword)}"
    >
      Signup
    </Button>
  </div>
{/if}
{#if signUpErrorMessage}
  <p class="error-message">{signUpErrorMessage}</p>
{/if}
{#if !signingUp}
  <div class="button-container">
    <Button on:click="{signIn}" disabled="{!(email && password)}">
      Log in
    </Button>
  </div>

  <Link style="margin-top: 15px;" to="/sign-up">
    Not a user yet? Sign up here
  </Link>
{/if}

<style lang="scss">
  .button-container,
  .checkbox-container {
    margin: 15px 0;
  }

  .error-message {
    color: red;
  }
</style>
