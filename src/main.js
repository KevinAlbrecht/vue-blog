// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'
import "fontsource-open-sans" 
export default function (Vue, { router, head, isClient, appOptions }) {
	// Set default layout as a global component
	Vue.component('Layout', DefaultLayout)

	// Hot Reload
	appOptions.i18n.setLocaleMessage('fr-fr', require('./locales/fr-fr.json'));
	appOptions.i18n.setLocaleMessage('en-us', require('./locales/en-us.json'));
	appOptions.i18n.setLocaleMessage('jp-ja', require('./locales/jp-ja.json'));

}
