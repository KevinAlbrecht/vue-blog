module.exports = {
	siteName: 'Kevin Albrecht',
	siteUrl: 'https://www.kevinalbrecht.dev',
	templates: {
		Post: '/blog/:title',
	},
	transformers: {
		remark: {
			externalLinksTarget: '_blank',
			externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
			plugins: [
				['@gridsome/remark-prismjs',
					{
						customClassPrefix: 'prism--',
						showLineNumbers: true
					}
				]
			]
		},
	},
	plugins: [
		{
			use: '@gridsome/plugin-sitemap',
			options: {
				exclude: [],
				config: {}
			}
		},
		{
			use: '@gridsome/plugin-google-analytics',
			options: {
				id: 'G-TCWL34Z756'
			}
		},
		{
			use: "gridsome-plugin-i18n",
			options: {
				locales: [
					'fr-fr',
					'en-us',
					'jp-ja'
				],
				pathAliases: {
					'fr-fr': 'fr',
					'en-us': 'en',
					'jp-ja': 'jp'
				},
				// fallbackLocale: 'en-us',
				defaultLocale: 'en-us',
				enablePathRewrite: false,
				// rewriteDefaultLanguage: true,
				//enablePathGeneration: true,
				// messages: {
				// 	'fr-fr': require('./src/locales/en-us.json'),
				// 	'en-us': require('./src/locales/en-us.json'),
				// 	'jp-ja': require('./src/locales/jp-ja.json'),
				// }
			}
		},
		{
			use: '@gridsome/source-filesystem',
			options: {
				path: 'content/posts/**/*.*.md',
				typeName: 'Post',
				refs: {
					tags: {
						typeName: 'Tag',
						route: '/tag/:id',
						create: true,
					},
				},
			}
		}
	]
}
