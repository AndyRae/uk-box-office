'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

/**
 * Sidebar link component
 * @description The sidebar link, will determine if the link is active.
 * @param {string} name - The name of the link.
 * @param {string} path - The path of the link.
 * @param {JSX.Element} icon - The icon of the link.
 * @param {boolean} isActive - Whether the link is active.
 * @returns {JSX.Element}
 * @example
 * <SideBarElement name='Dashboard' path='/' icon={<MdOutlineSpaceDashboard />} />
 */
export const SideBarLink = ({ name, path, icon, children }) => {
	const isActive = usePathname() === path;
	return (
		<Link
			href={path}
			as={Link}
			className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 ${
				isActive ? 'bg-gray-200 dark:bg-bo-primary' : ''
			}`}
		>
			{icon}
			<span className='ml-3'>{name}</span>
		</Link>
	);
};