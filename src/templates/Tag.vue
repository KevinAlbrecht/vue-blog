<template>
<Layout>
	<span>{{$page.tag.title}}</span>
</Layout>
</template>

<script>
export default {}
</script>

<page-query>
	query Tag ($id: ID!) {
		tag: tag (id: $id) {
			id
			title
		}
	}
</page-query>

<style>

</style>