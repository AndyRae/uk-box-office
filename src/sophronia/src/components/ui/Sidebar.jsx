import { FaGlobeEurope } from 'react-icons/fa';
import { BiFilm, BiNetworkChart } from 'react-icons/bi';
import { MdOutlineSpaceDashboard, MdOutlineAutoGraph } from 'react-icons/md';
import { HiOutlineTicket } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import { NavLink, Link } from 'react-router-dom';
import { Searchbar } from '../Search/Searchbar';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

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
		name: 'About',
		path: '/about',
		icon: <FaGlobeEurope />,
	},
];

const SideBarElement = ({ name, path, icon, children, isActive }) => {
	return (
		<NavLink
			to={path}
			as={Link}
			className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
				isActive ? 'bg-gray-200 dark:bg-blue-900' : ''
			}`}
		>
			{icon}
			<span className='ml-3'>{name}</span>
			{children}
		</NavLink>
	);
};

export const Brand = () => {
	return (
		<a href='/' className='flex items-center pl-2.5 mb-5'>
			<img
				src='https://flowbite.com/docs/images/logo.svg'
				className='mr-3 h-6 sm:h-7'
				alt='Logo'
			/>
			<span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
				Box Office Data
			</span>
		</a>
	);
};

const SidebarContent = () => {
	const { pathname } = useLocation();
	return (
		<div>
			<div class='flex flex-col space-y-6'>
				<Brand />

				{/* Links */}
				<ul className='space-y-2'>
					{links.map((element) => {
						return (
							<SideBarElement
								key={element.name}
								name={element.name}
								path={element.path}
								icon={element.icon}
								isActive={pathname === element.path}
							/>
						);
					})}
				</ul>

				<Searchbar />
			</div>

			<div className='p-4 mt-6 bg-blue-50 rounded-lg dark:bg-blue-900'>
				<div className='flex items-center mb-3'>
					<span className='bg-orange-100 text-orange-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900'>
						Beta
					</span>
					<button
						type='button'
						className='ml-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 inline-flex h-6 w-6 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800'
						data-collapse-toggle='dropdown-cta'
						aria-label='Close'
					>
						<span className='sr-only'>Close</span>
						<svg
							aria-hidden='true'
							className='w-4 h-4'
							fill='currentColor'
							viewBox='0 0 20 20'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								fillRule='evenodd'
								d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
								clipRule='evenodd'
							></path>
						</svg>
					</button>
				</div>
				<p className='mb-3 text-sm text-blue-900 dark:text-blue-400'>
					This is a beta version of the Box Office Data dashboard. We are still
					working on it and would love to hear your feedback.
				</p>
			</div>
		</div>
	);
};

export const Sidebar = ({ children }) => {
	return (
		<div class='relative lg:flex'>
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

			<input type='checkbox' id='menu-open' class='hidden' />

			{/* Mobile menu */}
			<header class='bg-gray-900 text-gray-100 flex justify-between lg:hidden'>
				<div className='mt-6 px-3'>
					<Brand />
				</div>

				<label
					for='menu-open'
					id='mobile-menu-button'
					class='m-4 p-2 focus:outline-none hover:text-white hover:bg-gray-700 rounded-md'
				>
					<AiOutlineMenu className='h-6 w-6' id='menu-open-icon' />
					<AiOutlineClose className='h-6 w-6' id='menu-close-icon' />
				</label>
			</header>

			{/* Sidebar */}
			<aside
				id='sidebar'
				class='bg-gray-900 h-screen fixed lg:sticky text-gray-100 w-72 space-y-6 pt-6 px-3 inset-y-0 left-0 transform  lg:translate-x-0 transition duration-150 ease-in-out lg:flex lg:flex-col overflow-y-auto'
			>
				<SidebarContent />
			</aside>
			<main className='grow'>{children}</main>
		</div>
	);
};
