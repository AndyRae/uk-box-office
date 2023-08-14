import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

/**
 * Datasource Card component
 * Quick component to add credit where necessary
 * @returns {JSX.Element}
 */
export const DatasourceCard = (): JSX.Element => {
	return (
		<div className='ml-2'>
			<div className='text-xs italic text-gray-700 dark:text-gray-400'>
				<a
					href='https://www.bfi.org.uk/industry-data-insights/weekend-box-office-figures'
					target='_blank'
					rel='noopener noreferrer'
				>
					Data Source
				</a>
			</div>
		</div>
	);
};

/**
 * Datasource Button component
 * Quick component to add credit where necessary with a button
 * @returns {JSX.Element}
 */
export const DatasourceButton = ({ className }: { className?: string }) => {
	const Icon = Icons['seedling'];
	return (
		<Button className={className} variant={'outline'}>
			<div className='px-1'>
				<Icon />
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
