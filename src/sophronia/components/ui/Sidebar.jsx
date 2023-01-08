import { FaGlobeEurope } from 'react-icons/fa';
import { BiFilm, BiNetworkChart } from 'react-icons/bi';
import { MdOutlineSpaceDashboard, MdOutlineAutoGraph } from 'react-icons/md';
import { HiOutlineTicket } from 'react-icons/hi';
import { FiDatabase } from 'react-icons/fi';
import { Searchbar } from '../Search/Searchbar';
import { SideBarLink } from './SideBarLink';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { BsListOl } from 'react-icons/bs';
import { Card } from '../Dashboard/Card';
import { InlineLink } from './InlineLink';
import Link from 'next/link';

// Quick links to display in the sidebar
const links = [
	{
		name: 'Dashboard',
		path: '/',
		icon: <MdOutlineSpaceDashboard />,
	},
	{
		name: 'Last Week',
		path: '/week',
		icon: <BiFilm />,
	},
	{
		name: 'All Time',
		path: '/time',
		icon: <HiOutlineTicket />,
	},
	{
		name: 'Forecast',
		path: '/forecast',
		icon: <MdOutlineAutoGraph />,
	},
	{
		name: 'Market Share',
		path: '/marketshare',
		icon: <BiNetworkChart />,
	},
	{
		name: 'Top Films',
		path: '/topfilms',
		icon: <BsListOl />,
	},
	{
		name: 'Open Data',
		path: '/opendata',
		icon: <FiDatabase />,
	},
	{
		name: 'About',
		path: '/about',
		icon: <FaGlobeEurope />,
	},
];

/**
 * Brand component
 * @description The brand logo and name.
 * @returns {JSX.Element}
 * @example
 * <Brand />
 */
export const Brand = () => {
	return (
		<Link href='/' className='flex items-center pl-2.5 mb-5'>
			<img src='/logo.svg' className='mr-3 h-6 sm:h-7' uk-svg='' />
			<span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
				Box Office Data
			</span>
		</Link>
	);
};

/**
 * SidebarContent component
 * @returns {JSX.Element}
 * @example
 * <SidebarContent />
 * @description The actual content of the sidebar.
 * @see Sidebar
 */
const SidebarContent = () => {
	return (
		<div>
			<div className='flex flex-col space-y-6'>
				<Brand />

				{/* Links */}
				<ul className='space-y-2'>
					{links.map((element) => {
						return (
							<SideBarLink
								key={element.name}
								name={element.name}
								path={element.path}
								icon={element.icon}
							/>
						);
					})}
				</ul>

				<Searchbar />

				<Card align='left' size='sm'>
					<div className='flex  mb-3'>
						<span className='bg-bo-primary text-gray-50 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded'>
							Beta
						</span>
					</div>
					<p className='mb-3 text-sm text-gray-900 dark:text-gray-50'>
						This is a beta version of the Box Office Data dashboard.
						<br></br>
						I'm always still working on it and would love to{' '}
						<InlineLink to='/contact'>get your feedback</InlineLink>.
					</p>
				</Card>
			</div>
		</div>
	);
};

/**
 * @file Sidebar.jsx
 * @description Sidebar component including links to other pages.
 * The page is built within the sidebar component to enable it to be hidden.
 * @param {Object} children - page content
 * @returns {JSX.Element}
 * @example
 * <Sidebar />
 */
export const Sidebar = ({ children }) => {
	return (
		<div className='relative lg:flex'>
			<style>
				{`
					#sidebar {
						--tw-translate-x: -100%;
						z-index: 100;
					}
					#menu-close-icon {
							display: none;
					}

					#menu-open:checked ~ #sidebar {
							--tw-translate-x: 0;
					}
					#menu-open:checked ~ * #mobile-menu-button {
							background-color: rgba(31, 41, 55, var(--tw-bg-opacity));
					}
					#menu-open:checked ~ * #menu-open-icon {
							display: none;
					}
					#menu-open:checked ~ * #menu-close-icon {
							display: block;
					}

					@media (min-width: 1024px) {
							#sidebar {
									--tw-translate-x: 0;
							}
					}
			`}
			</style>

			<input type='checkbox' id='menu-open' className='hidden' />

			{/* Mobile menu */}
			<header className='bg-white dark:bg-gray-900 dark:text-gray-100 flex sticky top-0 justify-between lg:hidden z-10'>
				<div className='mt-6 px-3'>
					<Brand />
				</div>

				<label
					htmlFor='menu-open'
					id='mobile-menu-button'
					className='m-4 p-2 focus:outline-none hover:text-white hover:bg-gray-700 rounded-md'
				>
					<AiOutlineMenu className='h-6 w-6' id='menu-open-icon' />
					<AiOutlineClose className='h-6 w-6' id='menu-close-icon' />
				</label>
			</header>

			{/* Sidebar */}
			<aside
				id='sidebar'
				className='bg-bo-grey dark:bg-black h-screen fixed lg:sticky dark:text-gray-100 w-72 grow-0 space-y-6 pt-6 px-3 inset-y-0 left-0 transform  lg:translate-x-0 transition duration-150 ease-in-out lg:flex-none overflow-y-auto'
			>
				<SidebarContent />
			</aside>
			<main className='grow'>{children}</main>
		</div>
	);
};