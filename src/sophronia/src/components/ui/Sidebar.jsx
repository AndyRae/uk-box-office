import { FaGlobeEurope } from 'react-icons/fa';
import { BiFilm, BiNetworkChart } from 'react-icons/bi';
import { MdOutlineSpaceDashboard, MdOutlineAutoGraph } from 'react-icons/md';
import { HiOutlineTicket } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const links = [
	{
		name: 'Dashboard',
		path: '/',
		icon: <MdOutlineSpaceDashboard />,
	},
	{
		name: 'Last Week',
		path: '/week',
		icon: <MdOutlineAutoGraph />,
	},
	{
		name: 'All Time',
		path: '/time',
		icon: <HiOutlineTicket />,
	},
	{
		name: 'Films',
		path: '/film',
		icon: <BiFilm />,
	},
	{
		name: 'Distributors',
		path: '/distributor',
		icon: <BiNetworkChart />,
	},
	{
		name: 'Countries',
		path: '/country',
		icon: <FaGlobeEurope />,
	},
	{
		name: 'Forecast',
		path: '/forecast',
		icon: <MdOutlineAutoGraph />,
	},
];

const SideBarElement = ({ name, path, icon, children }) => {
	const { pathname } = useLocation();
	const isActive = pathname === path;
	return (
		<Link
			to={path}
			as={Link}
			className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
				isActive ? 'bg-gray-200 dark:bg-blue-900' : ''
			}`}
		>
			{icon}
			<span className='ml-3'>{name}</span>
			{children}
		</Link>
	);
};

export const Sidebar = () => {
	return (
		<aside className='w-64 h-screen sticky' aria-label='Sidebar'>
			<div className='overflow-y-auto h-full py-4 px-3 bg-gray-50 dark:bg-slate-900'>
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
				<ul className='space-y-2'>
					{links.map((element) => {
						return (
							<SideBarElement
								key={element.name}
								name={element.name}
								path={element.path}
								icon={element.icon}
							/>
						);
					})}
				</ul>
				<div
					id='dropdown-cta'
					className='p-4 mt-6 bg-blue-50 rounded-lg dark:bg-blue-900'
					role='alert'
				>
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
						This is a beta version of the Box Office Data dashboard. We are
						still working on it and would love to hear your feedback.
					</p>
				</div>
			</div>
		</aside>
	);
};
