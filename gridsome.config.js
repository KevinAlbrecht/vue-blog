module.exports = {
	siteName: 'Kevin Albrecht',
	siteUrl: 'https://www.kevinalbrecht.dev',
	templates: {
		Post: '/blog/:title',
		Tag: '/tag/:title',
	},
	transformers: {
		remark: {
			externalLinksTarget: '_blank',
			externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
			plugins: [
				['@gridsome/remark-prismjs',
					{
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
					'en-us'
				],
				pathAliases: {
					'fr-fr': 'fr',
					'en-us': 'en'
				},
				// fallbackLocale: 'en-us',
				defaultLocale: 'en-us',
				enablePathRewrite: true,
				// rewriteDefaultLanguage: true,
				//enablePathGeneration: true,
				// messages: {
				// 	'fr-fr': require('./src/locales/en-us.json'),
				// 	'en-us': require('./src/locales/en-us.json'),
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
						create: true,
					},
				},
			}
		}
	]
}
