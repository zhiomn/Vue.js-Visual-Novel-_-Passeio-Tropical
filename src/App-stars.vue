<template>
  <div id="app">
    <!-- You can customize the number of stars with props -->
    <Stars :large-stars="10" :medium-stars="30">
      <!-- This content goes into the slot -->
      <div class="title">
        <span>
        </span>
      </div>
    </Stars>
  </div>
</template>

<script setup>
import Stars from './components/Stars.vue';
</script>

<style>
/* You can import fonts in your main CSS file or here */
@import url('https://fonts.googleapis.com/css?family=Lato:300,400,700');

/* Reset default styles */
body {
  margin: 0;
  padding: 0;
}

/* Styling for the title, mimicking the original example */
.title {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  font-size: 50px;
  letter-spacing: 10px;
  color: #FFF;
  padding-left: 10px; /* Fix for letter-spacing */
}

.title span {
  background: -webkit-linear-gradient(white, #38495a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
