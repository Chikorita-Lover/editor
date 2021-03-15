import Vue from 'vue'
import AppComponent from './App.vue'

import Vuetify from 'vuetify'
import en from '/@/locales/en'
import de from '/@/locales/de'
import nl from '/@/locales/nl'
import ko from '/@/locales/ko'
import '@mdi/font/css/materialdesignicons.min.css'
import { App } from './App'
import '/@/utils/locales'

// Disable until we move back to vite
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker.js?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker.js?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker.js?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker'
// @ts-ignore
self.MonacoEnvironment = {
	getWorker(_: unknown, label: string) {
		if (label === 'json') {
			return new jsonWorker()
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return new cssWorker()
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return new htmlWorker()
		}
		if (label === 'typescript' || label === 'javascript') {
			return new tsWorker()
		}
		return new editorWorker()
	},
}

Vue.config.productionTip = false

Vue.use(Vuetify)

export const vuetify = new Vuetify({
	lang: {
		locales: { nl, de, en, ko },
	},
	theme: {
		dark: true,
		options: {
			customProperties: true,
		},
		themes: {
			dark: {
				primary: '#0073FF',
				secondary: '#0073FF',
				accent: '#0073FF',

				background: '#121212',
				sidebarNavigation: '#1F1F1F',
				expandedSidebar: '#1F1F1F',
				menu: '#424242',
				footer: '#111111',
				tooltip: '#1F1F1F',
			},
			light: {
				primary: '#0073FF',
				secondary: '#0073FF',
				accent: '#0073FF',

				background: '#fafafa',
				sidebarNavigation: '#FFFFFF',
				expandedSidebar: '#FFFFFF',
				tooltip: '#424242',
				toolbar: '#e0e0e0',
				footer: '#f5f5f5',
			},
		},
	},
})

const vue = new Vue({
	vuetify,
	render: (h) => h(AppComponent),
})
vue.$mount('#app')

App.main(vue)
