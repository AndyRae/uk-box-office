import Link from 'next/link';
import { footerConfig, footerLink } from 'config/footer';
import { Icons } from 'components/icons';
import { Brand } from './sidebar';

/**
 * @file Footer.jsx
 * @description Footer component including links to other pages.
 * @returns {JSX.Element}
 * @example
 * <Footer />
 */
export const Footer = (): JSX.Element => {
	return (
		<footer className='p-4 md:p-6 border-t border-gray-600'>
			<Brand />
			<ul className='flex flex-col flex-wrap md:flex-row-reverse mt-3 text-sm sm:mt-0'>
				{footerConfig
					.map((link) => {
						return <FooterLink link={link} />;
					})
					.reverse()}
			</ul>
		</footer>
	);
};

const FooterLink = ({ link }: { link: footerLink }) => {
	const isLocalUrl = (link: string) => link.startsWith('/');
	const Icon = Icons[link.icon];

	return (
		<li
			key={link.name}
			className='mr-4 md:mr-6 leading-7 text-gray-500 dark:text-gray-400 hover:text-bo-primary'
		>
			{isLocalUrl(link.path) ? (
				<Link href={link.path} className='flex items-center'>
					<Icon className='mr-2' />
					{link.name}
				</Link>
			) : (
				<a
					href={link.path}
					target='_blank'
					rel='noopener noreferrer'
					className='flex items-center'
				>
					<Icon className='mr-2' />
					{link.name}
				</a>
			)}
		</li>
	);
};
