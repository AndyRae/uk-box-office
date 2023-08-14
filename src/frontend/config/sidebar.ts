import { Icons } from '@/components/icons';

type sidebarLink = {
	name: string;
	path: string;
	icon: keyof typeof Icons;
};

export const sidebarConfig: sidebarLink[] = [
	{
		name: 'Dashboard',
		path: '/',
		icon: 'dashboard',
	},
	{
		name: 'All Time',
		path: '/time',
		icon: 'ticket',
	},
	{
		name: 'Compare',
		path: '/compare',
		icon: 'compare',
	},
	{
		name: 'Forecast',
		path: '/forecast',
		icon: 'graph',
	},
	{
		name: 'Market Share',
		path: '/marketshare/distributors',
		icon: 'network',
	},
	{
		name: 'Top Films',
		path: '/topfilms',
		icon: 'list',
	},
	{
		name: 'Open Data',
		path: '/opendata',
		icon: 'database',
	},
	{
		name: 'About',
		path: '/about',
		icon: 'globe',
	},
];
