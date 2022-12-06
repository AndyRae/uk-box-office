import { Link } from 'react-router-dom';
import {
	FaNetworkWired,
	FaInfoCircle,
	FaEnvelope,
	FaFilm,
	FaGlobeEurope,
} from 'react-icons/fa';

const Links = [
	{
		name: 'Data Source',
		path: 'https://www.bfi.org.uk/industry-data-insights/weekend-box-office-figures',
		icon: <FaInfoCircle />,
	},
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
		<footer className='p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-900'>
			<span className='text-sm text-gray-500 sm:text-center dark:text-gray-400'>
				<a href='/' className='hover:underline'>
					UK Box Office
				</a>
			</span>
			<ul className='flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0'>
				{Links.map((link) => {

					const isLocalUrl = (link) => link.path.startsWith("/");
					return (
					<li key={link.name} className='mr-4 hover:underline md:mr-6'>
						{isLocalUrl(link) ? (
						<Link to={link.path} className='mr-4 hover:underline md:mr-6'>
							{link.name}
						</Link>
						) : (
						<a href
							={link.path}
							target='_blank'
							rel='noopener noreferrer'
							className='mr-4 hover:underline md:mr-6'
						>
							{link.name}
						</a>
						)}
					</li>
				);})}
			</ul>
		</footer>
	);
};
