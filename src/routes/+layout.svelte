<script>
  import '../app.css';
</script>

<div class="flex flex-col min-h-screen">
  <div class="navbar">
    <div class="flex-1">
      <a class="btn btn-ghost" href="/">
        <img src="./logo.webp" width="46" height="46" class="h-full" alt="Just Get Trained logo" />
        <div>
          <p class="text-2xl gap-0 leading-5">Just Get Trained</p>
        </div></a
      >
    </div>
    <div class="max-md:dropdown max-md:dropdown-end md:flex-none">
      <div tabindex="0" role="button" class="btn btn-ghost md:hidden" aria-label="Menu">
        <div class="rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h7"
            /></svg
          >
        </div>
      </div>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="mt-3 z-[1] p-2 max-md:shadow menu dropdown-content rounded-box max-md:w-40 md:menu-horizontal max-md:bg-base-200"
      >
        <li><a class="mx-auto" href="about">About Us</a></li>
        <li><a class="mx-auto" href="offer">Offer</a></li>
        <li><a class="mx-auto" href="contact">Contact</a></li>
        <li>
          <label class="flex cursor-pointer gap-2 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg
            >
            <input
              type="checkbox"
              value="garden"
              class="toggle theme-controller"
              aria-label="Theme switcher, dark mode and light mode."
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><circle cx="12" cy="12" r="5" /><path
                d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
              /></svg
            >
          </label>
        </li>
      </ul>
    </div>
  </div>

  <div class="max-md:w-full md:max-w-screen-xl mx-auto px-4 text-center flex-grow">
    <slot />
  </div>

  <footer class="text-center p-4 mt-8">
    <p>
      Copyright &copy; 2024 <a href="https://magickwings.com">Magick Wings</a>. All rights reserved.
      <a href="/privacy-policy">Privacy Policy</a>
    </p>
  </footer>
</div>
