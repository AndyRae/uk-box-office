import { Tooltip } from 'components/ui/Tooltip';
import { MetricChange } from 'components/charts/MetricChange';
import { TimeLineChart } from 'components/charts/TimeLineChart';
import { StackedBarChart } from 'components/charts/StackedBarChart';
import { Card } from 'components/ui/Card';
import { ChartWrapper } from 'components/charts/ChartWrapper';

/**
 * @description Skeleton Card loading components for loading state
 * @returns {JSX.Element}
 */
export const SkeletonCards = (): JSX.Element => {
	return (
		<div className='grid animate-pulse md:grid-cols-2 mt-6 lg:grid-cols-4 gap-3 md:gap-5'>
			<Card title='Total Box Office' subtitle='-'>
				<Tooltip text='Change from last year'>
					<MetricChange value={0} />{' '}
				</Tooltip>
			</Card>

			<Card title='Weekend Box Office' subtitle='-'>
				<Tooltip text='Change from last year'>
					{' '}
					<MetricChange value={0} />{' '}
				</Tooltip>
			</Card>

			<Card title='New Releases' subtitle='-'>
				<Tooltip text='Change from last year'>
					{' '}
					<MetricChange value={0} />{' '}
				</Tooltip>
			</Card>

			<Card title='New Releases' subtitle='-'>
				<Tooltip text='Change from last year'>
					{' '}
					<MetricChange value={0} />{' '}
				</Tooltip>
			</Card>
		</div>
	);
};

/**
 * @description Skeleton Film Table loading components for loading state
 * @returns {JSX.Element}
 */
export const SkeletonCharts = (): JSX.Element => {
	return (
		<div className='grid md:grid-cols-1 lg:grid-cols-2 mt-3 md:mt-6 gap-3 md:gap-5 animate-pulse transition'>
			<Card title='Box Office'>
				<TimeLineChart data={[]} height='md' />
			</Card>

			<Card title='Films'>
				<div className='mt-6'>
					<StackedBarChart data={[]} height='md' />
				</div>
			</Card>
		</div>
	);
};
