<template>
  <Layout>
    <!-- Learn how to use images here: https://gridsome.org/docs/images -->
    <g-image alt="Example image" src="~/favicon.png" width="135" />

    <h1>Hello, world!</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur
      excepturi labore tempore expedita, et iste tenetur suscipit explicabo!
      Dolores, aperiam non officia eos quod asperiores
    </p>
    <section>
      <article v-for="edge in $page.posts.edges" :key="edge.node.id">
        <PostPreview :post="edge.node"></PostPreview>
      </article>
    </section>
  </Layout>
</template>

<page-query>
query ($locale: String){
  posts: allPost(filter: { locale: {eq:$locale} } sortBy: "date", order: DESC ) {
    totalCount
    edges {
      node {
        path
        title
        id
        tags {id path __typename}
				timeToRead
				date
				description
				tags {
					id
					title
					path
				}
      }
    }
  }
}

</page-query>

<script>
import PostPreview from "../components/PostPreview";
export default {
  components: { PostPreview },
  metaInfo: {
    title: "Hello, world!",
  },
};
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
section article {
	padding: 50px 0;
  border-bottom: 1px solid #e2e8f0;
}
section article:last-child {
  border: none;
}
</style>
