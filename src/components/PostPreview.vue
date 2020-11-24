<template>
  <div class="post-preview__container">
    <PostHeader
      :date="post.date"
      :title="post.title"
      :tags="post.tags"
      :timeToRead="post.timeToRead"
    ></PostHeader>
    <p v-if="!cut">{{ post.excerpt }} ...</p>
    <g-link class="post__link" :to="$tp(post.path)"></g-link>
  </div>
</template>

<script>
import PostHeader from "./PostHeader";

export default {
  props: ["post", "cut"],
  components: { PostHeader },
};
</script>

<style>
.post-preview__container {
  position: relative;
}
.post-preview__container a.post__link {
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0px;
}
</style>