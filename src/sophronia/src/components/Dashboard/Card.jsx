export const Card = ({
	title,
	subtitle,
	children,
	size = 'md',
	align = 'center',
	className,
}) => {
	let cardSize;

	switch (size) {
		case 'sm':
			cardSize = ' md:py-3 md:px-6';
			break;
		case 'md':
			cardSize = ' md:p-6';
			break;
		case 'lg':
			cardSize = '';
			break;
		default:
			cardSize = '';
	}

	return (
		<div
			className={`${className} p-2 ${cardSize} max-w-full text-${align} bg-white rounded-lg shadow-lg  dark:bg-gray-900`}
		>
			<p className='font-normal text-sm text-gray-700 dark:text-gray-400'>
				{title}
			</p>
			<h5 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
				{subtitle}
			</h5>
			{children}
		</div>
	);
};
