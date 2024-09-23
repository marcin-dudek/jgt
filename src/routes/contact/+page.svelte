<script type="js">
  import { onMount } from 'svelte';
  import sendEmail from '$lib/email';

  const min = 50;

  //@type {Date | null}
  let time = null;
  let inputs = {
    name: '',
    email: '',
    phone: '',
    content: '',
    username: '',
    lastName: ''
  };

  let validate = false;
  let isFormValid = false;

  let toast = {
    message: '',
    type: ''
  };

  // @ts-ignore
  $: {
    isFormValid = inputs.email.trim() !== '';
  }

  /**
   * @type {{uuid:string, id: number, name: string, code:string, length?: number,width?: number, maxLength: number,maxWidth: number, thickness: number, quantity: number, description: string}[]}
   */
  let bucket = [];

  onMount(async () => {
    time = new Date();
  });

  const contactMe = async () => {
    if (inputs.username !== '' || inputs.lastName !== '') {
      //honeypot
      return;
    }

    // @ts-ignore
    if (time !== null && new Date() - time < 5000) {
      //honeypot
      return;
    }

    if (!isFormValid) {
      validate = true;
      showToast(
        'Can you please check provided data, looks like something is not as it should.',
        'warning'
      );
      return;
    }

    let ok = await sendEmail(inputs.name, inputs.email, inputs.content);

    if (!ok) {
      showToast('Oh! No! There was an issue with sending an email, please try again.', 'warning');
      return;
    }

    showToast('Message has been sent. You will get back to you within 3 business days.', 'success');
    inputs = {
      name: '',
      email: '',
      phone: '',
      content: '',
      username: '',
      lastName: ''
    };
    bucket = [];
  };

  // @ts-ignore
  const showToast = (message, type) => {
    toast = {
      // @ts-ignore
      message,
      type
    };
    setTimeout(() => {
      toast = {
        // @ts-ignore
        message: '',
        type: ''
      };
    }, 5000);
  };
</script>

<svelte:head>
  <title>Contact</title>
  <meta
    name="description"
    content="You can price decors here, specify material and dimensions. Or you can contact us for more information."
  />
</svelte:head>

<section>
  <div class="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
    <h2 class="mb-4 text-4xl tracking-tight font-extrabold">Contact Us</h2>
    <p class="mb-8 lg:mb-16">
      Got a question? What to get more information about us? Need any special training needs. Let us
      know.
    </p>
    <form action="#" class="space-y-8">
      <div>
        <label
          class="input input-bordered flex items-center gap-2 {validate &&
          inputs.email.trim() === ''
            ? 'input-error'
            : ''}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="w-4 h-4 opacity-70"
            ><path
              d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
            /><path
              d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
            /></svg
          >
          <input type="email" class="grow" placeholder="Mail" bind:value={inputs.email} />
        </label>
      </div>
      <div>
        <label class="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="w-4 h-4 opacity-70"
            ><path
              d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
            /></svg
          >
          <input type="text" class="grow" placeholder="Name" bind:value={inputs.name} />
        </label>
      </div>
      <div>
        <label class="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-4 h-4 opacity-70"
            ><path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            /><path d="M14.05 2a9 9 0 0 1 8 7.94" /><path d="M14.05 6A5 5 0 0 1 18 10" /></svg
          >
          <input type="phone" class="grow" placeholder="Phone" bind:value={inputs.phone} />
        </label>
      </div>
      <div class="sm:col-span-2">
        <textarea
          id="message"
          rows="6"
          maxlength="10000"
          class="textarea textarea-bordered w-full"
          placeholder="Ask us question..."
          bind:value={inputs.content}
        ></textarea>
      </div>
      <div>
        <label
          class="input input-bordered flex items-center gap-2"
          style="display:none !important"
          tabindex="-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-4 h-4 opacity-70"
            ><path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            /><path d="M14.05 2a9 9 0 0 1 8 7.94" /><path d="M14.05 6A5 5 0 0 1 18 10" /></svg
          >
          <input
            class="grow"
            placeholder="Username"
            bind:value={inputs.username}
            autocomplete="off"
          />
        </label>
      </div>
      <button
        type="submit"
        style="display:none !important"
        tabindex="-1"
        on:click={() => console.log('honeypot')}>Send</button
      >
      <button class="btn btn-primary py-3" on:click={contactMe}>Send message</button>
    </form>
  </div>
</section>

{#if toast.type !== ''}
  <div class="z-10 toast toast-top toast-center">
    {#if toast.type === 'warning'}
      <div class="alert alert-warning">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          /></svg
        >
        <span>{toast.message}</span>
      </div>
    {:else if toast.type === 'success'}
      <div class="alert alert-success">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          /></svg
        >
        <span>{toast.message}</span>
      </div>
    {/if}
  </div>
{/if}
