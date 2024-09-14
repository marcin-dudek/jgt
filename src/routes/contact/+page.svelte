<script type="js">
  import { onMount } from 'svelte';
  import ShortUniqueId from 'short-unique-id';
  import Fuse from 'fuse.js';
  import sendEmail from '$lib/email';
  import axios from 'axios';

  const min = 50;
  const uid = new ShortUniqueId();
  const fuseOptions = { keys: ['brand', 'code', 'name'] };

  //@type {Date | null}
  let time = null;
  let inputs = {
    name: '',
    email: '',
    phone: '',
    additional: '',
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
    isFormValid =
      inputs.email.trim() !== '' &&
      bucket.every(
        (x) =>
          isNumber(x.quantity) &&
          isNumber(x.length) &&
          isNumber(x.width) &&
          (x.length ?? 0) >= min &&
          (x.width ?? 0) >= min &&
          (x.quantity ?? 0) >= 0 &&
          (x.length ?? 0) <= x.maxLength &&
          (x.width ?? 0) <= x.maxWidth
      );
  }

  /**
   * @type {{uuid:string, id: number, name: string, code:string, length?: number,width?: number, maxLength: number,maxWidth: number, thickness: number, quantity: number, description: string}[]}
   */
  let bucket = [];

  // @ts-ignore
  let filtered = [];
  let search = '';
  // @ts-ignore
  let decors = [];
  onMount(async () => {
    time = new Date();
    const storedVersion = parseInt(localStorage.getItem('dataVersion') ?? '0', 10);
    let r = await axios.get('./info.json');
    const onlineVersion = parseInt(r.data.dataVersion, 10);
    if (onlineVersion <= storedVersion) {
      try {
        // @ts-ignore
        decors = JSON.parse(localStorage.getItem('decors'));
        if (decors !== null && decors.length > 0) {
          return;
        }
      } catch (e) {
        decors = [];
      }
    }
    let request = await axios.get('./data.json');
    decors = request.data;
    localStorage.setItem('dataVersion', r.data.dataVersion);
    localStorage.setItem('decors', JSON.stringify(decors));
    localStorage.setItem('date', JSON.stringify(new Date(Date.now()).toISOString()));
  });

  const handleSearch = () => {
    if (search === '') {
      filtered = [];
      return;
    }

    // @ts-ignore
    const f = new Fuse(decors, fuseOptions);
    filtered = f.search(search);
  };

  // @ts-ignore
  const selectItem = (item, thickness) => {
    search = '';
    filtered = [];

    let uuid = uid.seq();

    bucket = [
      // @ts-ignore
      ...bucket,
      // @ts-ignore
      {
        uuid: uuid,
        id: item.id,
        code: item.code,
        maxLength: item.length,
        maxWidth: item.width,
        name: item.name,
        thickness,
        quantity: 1,
        description: ''
      }
    ];
  };

  // @ts-ignore
  const deleteItem = (id) => {
    bucket = bucket.filter((x) => x.uuid !== id);
  };

  // @ts-ignore
  const isNumber = (value) => {
    return typeof value === 'number' && !isNaN(value);
  };

  const requestPricing = async () => {
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

    let ok = await sendEmail(uid.rnd(), bucket, inputs.name, inputs.email, inputs.additional);

    if (!ok) {
      showToast('Oh! No! There was an issue with sending an email, please try again.', 'warning');
      return;
    }

    showToast('Message has been sent. You will receive pricing within 3 business days.', 'success');
    inputs = {
      name: '',
      email: '',
      phone: '',
      additional: '',
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
  <title>Contact and pricing</title>
  <meta
    name="description"
    content="You can price decors here, specify material and dimensions. Or you can contact us for more information."
  />
</svelte:head>

<div class="hero">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">Pricing</h1>
    </div>
  </div>
</div>

<div class="dropdown w-80">
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <label tabindex="0" class="input input-bordered flex items-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      class="w-4 h-4 opacity-70"
      ><path
        fill-rule="evenodd"
        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
        clip-rule="evenodd"
      /></svg
    >
    <input
      type="text"
      class="grow"
      placeholder="Search for decor ..."
      bind:value={search}
      on:keyup={handleSearch}
    />
  </label>
  <div class="card compact dropdown-content z-[1] shadow bg-base-100 rounded-box w-80">
    {#each filtered as x}
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <div tabindex="0" class="card-body card-bordered">
        <h4 class="text-lg flex justify-between">
          <div>{x.item.code}</div>
          <div>{x.item.name}</div>
        </h4>
        <div class="w-full flex justify-between">
          <p>Brand: {x.item.brand}</p>
          <p>Core: {x.item.core}</p>
          <p>Length: {x.item.length}</p>
          <p>Width: {x.item.width}</p>
        </div>

        <div class="card-actions justify-end">
          Thickness (mm):
          {#each x.item.thickness as n}
            <button on:click={() => selectItem(x.item, n)} class="btn btn-xs btn-primary"
              >{n}</button
            >
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<div class="divider"></div>

{#if bucket.length > 0}
  <div class="overflow-x-auto">
    <table class="table max-md:table-xs">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Color</th>
            <th class="mx-auto text-center">
              <span class="max-md:hidden md:visible">Thick (mm)</span>
              <span class="max-md:visible md:hidden">Thick</span>
            </th>
            <th class="mx-auto text-center">
              <span class="max-md:hidden md:visible">Length (mm)</span>
              <span class="max-md:visible md:hidden">L</span>
            </th>
            <th class="mx-auto text-center">
              <span class="max-md:hidden md:visible">Width (mm)</span>
              <span class="max-md:visible md:hidden">W</span>
            </th>
            <th class="mx-auto text-center">
              <span class="max-md:hidden md:visible">Quantity</span>
              <span class="max-md:visible md:hidden">Qty</span>
            </th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        {#each bucket as item}
          <tr>
            <td>{item.code}</td>
            <td>{item.name}</td>
            <td>{item.thickness}</td>
            <td>
              <div class="tooltip tooltip-info" data-tip="Min:{min}, Max:{item.maxLength}">
                <input
                  bind:value={item.length}
                  class="input input-bordered input-xs rounded max-md:w-12 md:w-16 text-center
								{validate && ((item.length ?? 0) > item.maxLength || (item.length ?? 0) < 30) ? 'input-error' : ''}
								[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  {min}
                  max={item.maxLength}
                  type="number"
                  maxlength="4"
                />
              </div>
            </td>
            <td>
              <div class="tooltip tooltip-info" data-tip="Min:{min}, Max:{item.maxWidth}">
                <input
                  bind:value={item.width}
                  class="input input-bordered input-xs rounded max-md:w-12 md:w-16 text-center
									{validate && ((item.width ?? 0) > item.maxWidth || (item.width ?? 0) < 30) ? 'input-error' : ''}
									[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  {min}
                  max={item.maxWidth}
                  type="number"
                  maxlength="4"
                />
              </div>
            </td>
            <td>
              <input
                bind:value={item.quantity}
                class="input input-bordered input-xs rounded max-md:w-12 md:w-16 text-center {item.quantity <
                1
                  ? 'input-error'
                  : ''} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                type="number"
                min="1"
              /></td
            >
            <td>
              <input
                bind:value={item.description}
                class="input input-bordered input-xs rounded max-md:w-24 md:w-50"
                type="text"
                maxlength="50"
              /></td
            >
            <td>
              <button
                class="btn btn-square btn-xs align-middle"
                on:click={() => deleteItem(item.uuid)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  /></svg
                >
              </button>
            </td>
          </tr>
        {/each}
      </table>
    </table>
  </div>
  <div class="divider"></div>
{/if}

<div class="card gap-2 w-80 mx-auto">
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
  <label
    class="input input-bordered flex items-center gap-2 {validate && inputs.email.trim() === ''
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
  <input
    type="text"
    placeholder="lastName"
    style="display:none !important"
    tabindex="-1"
    autocomplete="off"
    bind:value={inputs.lastName}
  />
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
    <input class="grow" placeholder="Username" bind:value={inputs.username} autocomplete="off" />
  </label>
  <textarea
    class="textarea textarea-bordered flex items-center gap-2"
    placeholder="Additional information"
    maxlength="1000"
    bind:value={inputs.additional}
  ></textarea>
  <button
    type="submit"
    style="display:none !important"
    tabindex="-1"
    on:click={() => console.log('honeypot')}>Send</button
  >

  <button class="btn btn-primary" on:click={requestPricing}>Request pricing</button>
</div>

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
