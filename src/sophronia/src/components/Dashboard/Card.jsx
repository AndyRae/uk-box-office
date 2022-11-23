export const Card = ({ title, subtitle, children }) => {
	return (
		<div className='block p-2 md:p-6 max-w-md text-center bg-white rounded-lg border border-gray-200 shadow-xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'>
			<p className='font-normal text-sm text-gray-700 dark:text-gray-400'>
				{title}
			</p>
			<h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
				{subtitle}
			</h5>
			{children}
		</div>
	);
};
