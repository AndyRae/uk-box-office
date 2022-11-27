import { Card } from './Card';

export const LastUpdated = ({ date }) => {
	const today = new Date();
	const lastUpdated = new Date(date);

	const diffTime = Math.abs(today - lastUpdated);
	let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	if (isNaN(diffDays)) {
		diffDays = '-';
	}

	return (
		<div className='md:ml-auto'>
			<Card size='sm'>
				<div className='text-xs italic text-gray-700 dark:text-gray-400'>
					{diffDays === 0
						? 'Updated today'
						: `Updated ${diffDays} day${diffDays === 1 ? '' : 's'} ago`}
				</div>
			</Card>
		</div>
	);
};
