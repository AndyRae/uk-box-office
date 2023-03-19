'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

type SideBarLinkProps = {
	name: string;
	path: string;
	icon: JSX.Element;
};

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
export const SideBarLink = ({
	name,
	path,
	icon,
}: SideBarLinkProps): JSX.Element => {
	const isActive = usePathname() === path;
	return (
		<Link
			href={path}
			className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white bg-gradient-to-br from-transparent to-transparent hover:from-bo-primary hover:to-cyan-500 ${
				isActive ? 'from-bo-primary to-cyan-500' : ''
			}`}
		>
			{icon}
			<span className='ml-3'>{name}</span>
		</Link>
	);
};
