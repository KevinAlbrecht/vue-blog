<template>
  <Layout>
    <h1>{{ $t("about.title") }}</h1>
    <p  v-html="$page.about.content"></p>
  </Layout>
</template>

<script>
export default {};
</script>
<page-query>
	query About ($id: ID!) {
		about: about (id: $id) {
			content
		}
	}
</page-query>