import { Link } from 'react-router-dom';
import {
	FaNetworkWired,
	FaLock,
	FaHome,
	FaInfoCircle,
	FaEnvelope,
	FaCode,
	FaFilm,
	FaGlobeEurope,
} from 'react-icons/fa';

const Links = [
	{
		name: 'About',
		path: '/about',
		icon: <FaInfoCircle />,
	},
	{
		name: 'Contact',
		path: '/contact',
		icon: <FaEnvelope />,
	},
	{
		name: 'Privacy',
		path: '/privacy',
		icon: <FaLock />,
	},
	{
		name: 'API',
		path: '/api',
		icon: <FaCode />,
	},
	{
		name: 'Films',
		path: '/films',
		icon: <FaFilm />,
	},
	{
		name: 'Distributors',
		path: '/distributors',
		icon: <FaNetworkWired />,
	},
	{
		name: 'Countries',
		path: '/countries',
		icon: <FaGlobeEurope />,
	},
];

export const Footer = () => {
	return (
		<footer class='p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800'>
			<span class='text-sm text-gray-500 sm:text-center dark:text-gray-400'>
				<a href='/' class='hover:underline'>
					UK Box Office
				</a>
			</span>
			<ul class='flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0'>
				{Links.map((link) => (
					<li class='mr-4 hover:underline md:mr-6'>
						<Link to={link.path} class='mr-4 hover:underline md:mr-6'>
							{link.name}
						</Link>
					</li>
				))}
			</ul>
		</footer>
	);
};
