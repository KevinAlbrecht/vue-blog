<template>
  <header>
    <h1>{{ title }}</h1>
    <small class="date">{{ $moment(date).format("MMMM DD YYYY") }}</small>
    <small>{{ timeToRead }} {{ $t("common.mins") }}</small>
    <small class="tags">
      <g-link v-for="tag in tags" :key="tag.id" :to="tag.path" class="tag">
        {{ tag.title }}
      </g-link>
    </small>
  </header>
</template>

<script>
export default {
  props: ["title", "date", "tags", "timeToRead"],
};
</script>

<style scoped>
small {
  margin-right: 20px;
}
small:last-child {
  margin-right: 0;
}
header .tags .tag {
  margin-right: 10px;
  background: #1a8765;
  padding: 4px 6px;
  color: white;
}

header .tags .tag:last-child {
  margin-right: 0;
}

</style>