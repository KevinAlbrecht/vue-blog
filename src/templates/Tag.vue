<template>
  <Layout>
    <p>{{ $t("tag.title") }} "{{ $page.tag.title }}"</p>
    <section>
      <article v-for="post in posts" :key="post.id">
        <PostPreview :post="post.node" :cut="true"></PostPreview>
      </article>
    </section>
  </Layout>
</template>

<script>
import PostPreview from "../components/PostPreview";
export default {
  components: { PostPreview },
  computed: {
    // can't retrieve $locale in the Tag Template so can't filter query => filtering in view
    posts() {
      return this.$page.rawPosts.edges.filter((p) => {
        console.log(p.node, this.$context.locale);
        return p.node.locale === this.$context.locale;
      });
    },
  },
};
</script>

<page-query>
query ($locale: String, $id:ID){
  rawPosts: allPost(
					filter: { locale: {eq:$locale},tags: {contains: [$id]}}, 
					sortBy: "date", order: DESC ) {
    totalCount
    edges {
      node {
        path
        title
        id
				locale
        tags {id path __typename}
				timeToRead
				date
				excerpt
				tags {
					id
					title
					path
				}
      }
    }
  }
	tag: tag(id:$id){
		title
	}
}
</page-query>

<style>
section article {
  padding: 50px 0;
  border-bottom: 1px solid #e2e8f0;
}
section article:last-child {
  border: none;
}
</style>