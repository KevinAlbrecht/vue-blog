<template>
  <div id="lang-container" @click="localeChanged">
    <span
      class="locale"
      v-for="locale in availableLocales"
      :key="locale"
      :lang="locale"
      :class="{ selected: locale === currentLocale }"
    >
      {{ $t(`locales.${locale}`) }}
    </span>
  </div>
</template>
<script>
export default {
  methods: {
    localeChanged(evt) {
      this.currentLocale = evt.target.lang;
      this.$router.push({
        path: this.$tp(this.$route.path, this.currentLocale, true),
      });
    },
  },
  data: function () {
    return {
      currentLocale: this.$i18n.locale.toString(),
      availableLocales: this.$i18n.availableLocales,
    };
  },
};
</script>

<style scoped>
#lang-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
}

#lang-container .locale {
  color: #333;
  cursor: pointer;
}

#lang-container .locale:hover {
  border-bottom: 1px solid #333;
}

#lang-container .locale.selected {
  color: #1a836b;
  border-bottom: 1px solid #1a836b;
}
</style>