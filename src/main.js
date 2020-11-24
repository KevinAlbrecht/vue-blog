// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue';
import "fontsource-open-sans";
// import 'prismjs/themes/prism.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import moment from 'moment';
export default function (Vue, { head, appOptions }) {
	Vue.component('Layout', DefaultLayout)

	Vue.prototype.$moment = moment;
	Vue.prototype.$templateEventBus = new Vue();

	// Hot Reload
	appOptions.i18n.setLocaleMessage('fr-fr', require('./locales/fr-fr.json'));
	appOptions.i18n.setLocaleMessage('en-us', require('./locales/en-us.json'));

	head.meta.push({
		name: 'google-site-verification',
		content: 'uGz9lYl9lLxED-WftCjT4oQopgdqOrn_TOX-4JHN8RQ'
	});
	head.meta.push({
		name: 'robots',
		content: 'index, follow, all'
	});
}