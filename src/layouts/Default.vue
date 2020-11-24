<template>
  <div class="layout">
    <header class="header">
      <strong>
        <span>{{ $static.metadata.siteName }}</span>
      </strong>
      <nav class="nav nav-pages">
        <g-link class="nav__link" :to="$tp('/')">{{ $t("nav.home") }}</g-link>
        <g-link class="nav__link" :to="$tp('/about/')">{{
          $t("nav.about")
        }}</g-link>
      </nav>
      <nav class="nav nav-lang">
        <locale-switcher></locale-switcher>
      </nav>
    </header>
    <slot />
    <footer></footer>
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>
<script>
import LocaleSwitcher from "../components/LocaleSwitcher";
export default {
  components: { LocaleSwitcher },
};
</script>
<style src="~/assets/styles/style.css"></style>
<style>


.layout {
  max-width: 760px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  height: 80px;
}

.nav__link {
  margin-left: 20px;
}

.nav-pages {
  flex: 1;
}

a {
  text-decoration: none;
  color: #333;
}
</style>
