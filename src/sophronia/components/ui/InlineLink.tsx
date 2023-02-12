import Link from 'next/link';

/**
 * Simple wrapper for a link to add some styling.
 * @param {to} URL to link to
 * @param {children} Children to render
 * @returns Link component
 */
export const InlineLink = ({
	to,
	children,
}: {
	to: string;
	children: React.ReactNode;
}): JSX.Element => (
	<Link href={to} className='text-bo-primary hover:text-red-500'>
		{children}
	</Link>
);

/**
 * Simple wrapper for a link to add some styling.
 * @param {to} URL to link to
 * @param {children} Children to render
 * @returns Link component
 */
export const ExternalLink = ({
	to,
	children,
}: {
	to: string;
	children: React.ReactNode;
}): JSX.Element => (
	<a
		href={to}
		className='text-bo-primary hover:text-red-500'
		target='_blank'
		rel='noopener noreferrer'
	>
		{children}
	</a>
);
