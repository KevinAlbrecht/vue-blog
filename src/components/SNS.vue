<template>
  <div>
    <g-link :to="'https://github.com/KevinAlbrecht'"
      ><font-awesome :icon="['fab', 'github']"
    /></g-link>
    <g-link :to="'https://twitter.com/kalbrecht_fr'"
      ><font-awesome :icon="['fab', 'twitter']"
    /></g-link>
    <g-link :to="'https://www.linkedin.com/in/albrechtkevin/'"
      ><font-awesome :icon="['fab', 'linkedin']"
    /></g-link>
    <g-link :to="'mail:kevin.albrecht@outlook.com'"
      ><font-awesome :icon="['fab', 'email']"
    /></g-link>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
a {
  color: #333;
    margin-right: 28px;
    font-size: 28px;
}
</style>