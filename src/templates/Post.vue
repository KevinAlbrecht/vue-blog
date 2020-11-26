<template>
  <Layout>
    <article>
      <PostHeader
        :date="$page.post.date"
        :title="$page.post.title"
        :tags="$page.post.tags"
        :timeToRead="$page.post.timeToRead"
      ></PostHeader>
      <p v-html="$page.post.content"></p>
    </article>
    <Disqus shortname="kalbrecht-dev" />
  </Layout>
</template>

<page-query>
	query Post ($id: ID!) {
		post: post (id: $id) {
			locale
			title
			date
			content,
timeToRead
			belongs {
				fr_fr 
				en_us
			}
			tags {
				id
				title
				path
			}
		}
	}
</page-query>

<script>
import PostHeader from "../components/PostHeader";
import { Disqus } from "vue-disqus";

export default {
  components: { PostHeader, Disqus },
};
</script>

<style scoped>
header {
  margin-bottom: 50px;
}
</style>