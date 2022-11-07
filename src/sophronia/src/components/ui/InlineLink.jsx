import { Link } from 'react-router-dom';

/**
 * Simple wrapper for a link to add some styling.
 * @param {to} URL to link to
 * @param {children} Children to render
 * @returns Link component
 */
export const InlineLink = ({ to, children }) => (
	<Link to={to} className='text-blue-500 hover:text-blue-600'>
		{children}
	</Link>
);

/**
 * Simple wrapper for a link to add some styling.
 * @param {to} URL to link to
 * @param {children} Children to render
 * @returns Link component
 */
export const ExternalLink = ({ to, children }) => (
	<a href={to} className='text-blue-500 hover:text-blue-600' target='_blank'>
		{children}
	</a>
);
