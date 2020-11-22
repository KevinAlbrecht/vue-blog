<template>
  <Layout>
    <h1>{{ $page.post.title }}</h1>
    <p v-html="$page.post.content"></p>
  </Layout>
</template>
<page-query>
	query Post ($path: String!) {
		post: post (path: $path) {
			title
content
		}
	}
</page-query>
<script>
export default {};
</script>

<style>
</style>