import { ViteSSG } from 'vite-ssg';
import App from './App.vue';
import { routes } from './router';
import './styles.css';

export const createApp = ViteSSG(
	App,
	{
		routes,
		scrollBehavior(to, from, savedPosition) {
			if (to.hash) return { el: to.hash, behavior: 'smooth' };
			if (savedPosition) return savedPosition;
			return { top: 0 };
		},
	},
);