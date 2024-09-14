<script>
  let files = [
    './portfolio/img_g1_w1024.webp',
    './portfolio/img_g2_w1024.webp',
    './portfolio/img_g3_w1024.webp',
    './portfolio/img_g4_w1024.webp',
    './portfolio/img_g5_w1024.webp',
    './portfolio/img_g6_w1024.webp'
  ];
</script>

<svelte:head>
  <title>Portfolio</title>
  <meta
    name="description"
    content="Here you can find some images of our previous work. We specialize in crafting personalized sanctuaries that resonate with your vision."
  />
</svelte:head>

<div class="hero">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">Our work</h1>
    </div>
  </div>
</div>

<div class="max-w-xl w-full carousel carousel-center rounded-box">
  {#each files as file, i}
    <div id="item{i + 1}" class="carousel-item w-full">
      {#if i == 0}
        <img class="w-full" src={file} alt="Burger" />
      {:else}
        <img class="w-full" loading="lazy" src={file} alt="Burger" />
      {/if}
    </div>
  {/each}
</div>

<div class="join flex justify-center w-full">
  {#each files as file, i}
    <a href="#item{i + 1}" class="join-item btn btn-xs">{i + 1}</a>
  {/each}
</div>
