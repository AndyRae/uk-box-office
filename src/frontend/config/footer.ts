// Quick links to display in the footer
import { Icons } from 'components/icons';

export type footerLink = {
	name: string;
	path: string;
	icon: keyof typeof Icons;
};

export const footerConfig: footerLink[] = [
	{
		name: 'Data Source',
		path: 'https://www.bfi.org.uk/industry-data-insights/weekend-box-office-figures',
		icon: 'seedling',
	},
	{
		name: 'Github',
		path: 'https://github.com/andyrae/uk-box-office',
		icon: 'github',
	},
	{
		name: 'About',
		path: '/about',
		icon: 'info',
	},
	{
		name: 'Contact',
		path: '/contact',
		icon: 'envelope',
	},
	{
		name: 'Films',
		path: '/film',
		icon: 'film',
	},
	{
		name: 'Distributors',
		path: '/distributor',
		icon: 'network',
	},
	{
		name: 'Countries',
		path: '/country',
		icon: 'globe',
	},
	{
		name: 'Status',
		path: '/status',
		icon: 'status',
	},
];
