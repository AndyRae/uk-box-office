import Link from 'next/link';
import { footerConfig } from 'config/footer';

/**
 * @file Footer.jsx
 * @description Footer component including links to other pages.
 * @returns {JSX.Element}
 * @example
 * <Footer />
 */
export const Footer = (): JSX.Element => {
	return (
		<footer className='p-4 bg-white md:flex md:items-center md:justify-between md:p-6 dark:bg-black border-t border-gray-600'>
			<span className='text-sm text-gray-500 sm:text-center dark:text-gray-400'>
				<a href='/' className='hover:underline'>
					UK Box Office
				</a>
			</span>
			<ul className='flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0'>
				{footerConfig.map((link) => {
					const isLocalUrl = (link: string) => link.startsWith('/');

					return (
						<li key={link.name} className='mr-4 hover:underline md:mr-6'>
							{isLocalUrl(link.path) ? (
								<Link href={link.path} className='mr-4 hover:underline md:mr-6'>
									{link.name}
								</Link>
							) : (
								<a
									href={link.path}
									target='_blank'
									rel='noopener noreferrer'
									className='mr-4 hover:underline md:mr-6'
								>
									{link.name}
								</a>
							)}
						</li>
					);
				})}
			</ul>
		</footer>
	);
};
