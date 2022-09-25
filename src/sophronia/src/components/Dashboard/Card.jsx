import { Link } from 'react-router-dom';

export const Card = ({ title, subtitle, children, link }) => {
	return (
		<a
			href={link}
			className='block p-6 max-w-sm text-center bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
		>
			<h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
				{subtitle}
			</h5>
			{children}
			<p className='font-normal text-gray-700 dark:text-gray-400'>{title}</p>
		</a>
	);
};
