import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import { RiSeedlingLine } from 'react-icons/ri';

/**
 * Datasource Card component
 * Quick component to add credit where necessary
 * @returns {JSX.Element}
 */
export const DatasourceCard = (): JSX.Element => {
	return (
		<div className='ml-2'>
			<Card size='sm' status='transparent'>
				<div className='text-xs italic text-gray-700 dark:text-gray-400'>
					<a
						href='https://www.bfi.org.uk/industry-data-insights/weekend-box-office-figures'
						target='_blank'
						rel='noopener noreferrer'
					>
						Data Source
					</a>
				</div>
			</Card>
		</div>
	);
};

/**
 * Datasource Button component
 * Quick component to add credit where necessary with a button
 * @returns {JSX.Element}
 */
export const DatasourceButton = () => {
	return (
		<Button>
			<div className='px-1'>
				<RiSeedlingLine />
			</div>
			<a
				href='https://www.bfi.org.uk/industry-data-insights/weekend-box-office-figures'
				target='_blank'
				rel='noopener noreferrer'
			>
				Data Source
			</a>
		</Button>
	);
};
