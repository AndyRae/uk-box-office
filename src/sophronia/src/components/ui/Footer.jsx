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
		name: 'API',
		path: '/api',
		icon: <FaCode />,
	},
	{
		name: 'Films',
		path: '/film',
		icon: <FaFilm />,
	},
	{
		name: 'Distributors',
		path: '/distributor',
		icon: <FaNetworkWired />,
	},
	{
		name: 'Countries',
		path: '/country',
		icon: <FaGlobeEurope />,
	},
];

export const Footer = () => {
	return (
		<footer className='p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800'>
			<span className='text-sm text-gray-500 sm:text-center dark:text-gray-400'>
				<a href='/' className='hover:underline'>
					UK Box Office
				</a>
			</span>
			<ul className='flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0'>
				{Links.map((link) => (
					<li key={link.name} className='mr-4 hover:underline md:mr-6'>
						<Link to={link.path} className='mr-4 hover:underline md:mr-6'>
							{link.name}
						</Link>
					</li>
				))}
			</ul>
		</footer>
	);
};
