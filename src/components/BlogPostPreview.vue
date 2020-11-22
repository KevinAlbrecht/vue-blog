<template><div>
<g-link :to="post.path">
   <h2 v-html="post.title"></h2>
</g-link>
</div>
</template>

<script>
export default {
  props: ["post"],
};
</script>

<style>
</style>