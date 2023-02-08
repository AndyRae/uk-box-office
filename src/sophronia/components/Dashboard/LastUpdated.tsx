import { Card } from 'components/ui/Card';

/**
 * @file LastUpdated.jsx
 * @description Last updated component for dashboard
 * @param {String} date - Date of last update
 * @returns {JSX.Element}
 * @example
 * <LastUpdated date="2021-05-01" />
 */
export const LastUpdated = ({ date }: { date?: string }): JSX.Element => {
	const today = new Date();
	const lastUpdated = new Date(date);

	const diffTime = Math.abs(today.getTime() - lastUpdated.getTime());
	let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	if (isNaN(diffDays)) {
		diffDays = 0;
	}

	return (
		<div className='md:ml-auto'>
			<Card size='sm'>
				<div
					className='text-xs italic text-gray-700 dark:text-gray-400'
					suppressHydrationWarning
				>
					{diffDays === 0
						? 'Updated today'
						: `Updated ${diffDays} day${diffDays === 1 ? '' : 's'} ago`}
				</div>
			</Card>
		</div>
	);
};