<template>
  <Layout>
    <div id="not-found" class="center">
      <h1>404</h1>
      <MoonSigh class="center"></MoonSigh>
      <p></p>
    </div>
  </Layout>
</template>
<script>
import MoonSigh from "../components/emoji/MoonSigh";
export default {
  components: { MoonSigh },
};
</script>
<style scoped>
div#not-found h1 {
    text-align: center;
}

.center {
  margin: auto;
}
</style>