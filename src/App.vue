<script setup>
</script>

<template>
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
}

#app {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

@media (max-width: 768px) {
  #app {
    padding: 0;
  }
}
</style>
