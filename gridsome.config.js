module.exports = {
	siteName: 'Kevin Albrecht',
	siteUrl: 'https://www.kevinalbrecht.dev',
	templates: {
		Post: '/blog/:title',
		Tag: '/tag/:title',
		About: '/:title',
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
				id: 'G-X3J8H29RBT'
			}
		},
		{
			use: "gridsome-plugin-i18n",
			options: {
				locales: [
					'en-us',
					'fr-fr'
				],
				pathAliases: {
					'en-us': 'en',
					'fr-fr': 'fr'
				},
				defaultLocale: "en-us",
				enablePathRewrite: true,
				rewriteDefaultLanguage: false,
				messages: {
					"en-us": require('./src/locales/en-us.json'),
					"fr-fr": require('./src/locales/fr-fr.json')
				}
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
		},
		{
			use: '@gridsome/source-filesystem',
			options: {
				path: 'content/about/*.md',
				typeName: 'About',
			}
		}
	]
}
