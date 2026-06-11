import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	vite: {
		plugins: [llmstxt()],
	},
	srcDir: 'doc',
	base: '/nsd/',

	title: 'NSD Dialecte',
	description: 'IEC 61850 NSD, fully typed',

	themeConfig: {
		search: {
			provider: 'local',
		},

		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Guide', link: '/guide/introduction/getting-started' },
			{ text: 'API', link: '/api/types' },
			{
				text: 'LLMs',
				items: [
					{ text: 'llms.txt', link: '/nsd/llms.txt', target: '_blank' },
					{ text: 'llms-full.txt', link: '/nsd/llms-full.txt', target: '_blank' },
				],
			},
		],

		sidebar: {
			'/guide/': [
				{
					text: 'Getting Started',
					items: [
						{ text: 'Introduction', link: '/guide/introduction/what-is-nsd-dialecte' },
						{ text: 'Quick Start', link: '/guide/introduction/getting-started' },
					],
				},
			],
			'/api/': [
				{
					text: 'API',
					items: [
						{ text: 'Types', link: '/api/types' },
						{ text: 'Test Helpers', link: '/api/test-helpers' },
					],
				},
				{
					text: 'Core',
					items: [
						{
							text: 'Query / Transaction / Document',
							link: 'https://dialecte.github.io/core/api/',
						},
					],
				},
			],
		},

		socialLinks: [{ icon: 'github', link: 'https://github.com/dialecte/nsd' }],
	},
})
