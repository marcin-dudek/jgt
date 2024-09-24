<script>
  // import logo from '../img/image2.webp';
</script>

<svelte:head>
  <title>Just Get Trained</title>
  <meta
    name="description"
    content="Welcome to Just Get Trained. You can find more information about us and what we do."
  />
</svelte:head>

<div class="flex flex-col">
  <h1 class="text-5xl font-bold mx-auto">Welcome to JTG</h1>
  <p class="py-6">
    Just Get Trained is dedicated to providing top-notch training and certification services that
    empower individuals and organizations in the construction and related industries. With a focus
    on practical skills, safety, and professional growth, Just Get Trained offers a range of
    training solutions designed to meet the needs of today's workforce.
  </p>
  <!-- <p class="py-6">
		Step into a realm where every detail matters, where your dreams and our craftsmanship
		converge to create spaces that transcend the ordinary. Welcome to a world where wood isn't
		just a material; it's the soul of design.
	</p> -->
  <p class="py-6 mx-auto">
    <picture>
      <source media="(max-width:md)" srcset="./img/home_300.webp" />
      <source media="(min-width:lg)" srcset="./img/home_750.webp" />
      <img src="./img/home_750.webp" alt="Man in cask drawing with pencil in notebook." />
    </picture>
  </p>
</div>
