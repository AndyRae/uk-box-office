import { Searchbar } from '@/components/search';
import { SideBarLink } from './sidebar-link';
import { InlineLink } from './inline-link';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { sidebarConfig } from '@/config/sidebar';
import { ModeToggle } from '@/components/ui/mode-toggle';

/**
 * Brand component
 * @description The brand logo and name.
 * @returns {JSX.Element}
 * @example
 * <Brand />
 */
export const Brand = (): JSX.Element => {
	return (
		<Link href='/' className='flex items-center pl-2.5 mb-5'>
			<img
				src='/logo.svg'
				className='mr-3 h-6 sm:h-7 w-6 sm:w-7'
				alt='UK Box Office Logo'
			/>
			<span className='self-center text-xl font-semibold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-br from-black to-black dark:from-white dark:to-white hover:from-bo-primary hover:to-cyan-500'>
				Box Office Data
			</span>
		</Link>
	);
};

const Announcement = (): JSX.Element => {
	return (
		<Card>
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
const SidebarContent = (): JSX.Element => {
	return (
		<div>
			<div className='flex flex-col space-y-6'>
				<Brand />

				{/* Links */}
				<nav className='space-y-2'>
					{sidebarConfig.map((element) => {
						return (
							<SideBarLink
								key={element.name}
								name={element.name}
								path={element.path}
								icon={element.icon}
							/>
						);
					})}
				</nav>

				<Searchbar />
				<ModeToggle />
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
export const Sidebar = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	const MenuIcon = Icons['menu'];
	const CloseIcon = Icons['close'];
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
			<header className='bg-white dark:bg-black dark:text-gray-100 flex sticky top-0 justify-between lg:hidden z-10'>
				<div className='mt-6 px-3'>
					<Brand />
				</div>

				<label
					htmlFor='menu-open'
					id='mobile-menu-button'
					className='m-4 p-2 focus:outline-none hover:text-white hover:bg-gray-700 rounded-md'
				>
					<MenuIcon className='h-6 w-6' id='menu-open-icon' />
					<CloseIcon className='h-6 w-6' id='menu-close-icon' />
				</label>
			</header>

			{/* Sidebar */}
			<aside
				id='sidebar'
				className='bg-white dark:bg-black h-screen fixed lg:sticky dark:text-gray-100 w-72 grow-0 space-y-6 pt-6 px-3 inset-y-0 left-0 transform  lg:translate-x-0 transition duration-150 ease-in-out lg:flex-none overflow-y-auto'
			>
				<SidebarContent />
			</aside>
			<main className='grow bg-white dark:bg-black'>{children}</main>
		</div>
	);
};
