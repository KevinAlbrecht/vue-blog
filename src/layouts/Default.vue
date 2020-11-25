<template>
  <div class="layout">
    <header class="header">
      <nav>
        <div>
          <span class="title">Kevin ALBRECHT</span>
          <g-link class="nav__link" :to="$tp('/')">{{ $t("nav.home") }}</g-link>
          <g-link class="nav__link" :to="$tp(`/${$context.locale === 'en-us'?'about':'a-propos'}`)">{{
            $t("nav.about")
          }}</g-link>
        </div>
        <locale-switcher></locale-switcher>
      </nav>
      <SNS></SNS>
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
import SNS from "../components/SNS";
export default {
  components: { LocaleSwitcher, SNS },
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
  flex-direction: column;
  justify-content: center;
  margin-bottom: 20px;
  height: 120px;
}

nav {
  display: flex;
  justify-content: space-between;
}

nav .title {
  margin-right: 30px;
  font-weight: 600;
}
.nav__link {
  margin-right: 20px;
}

footer {
  height: 50px;
}
</style>
