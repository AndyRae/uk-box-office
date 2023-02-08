import { ButtonGroup } from '../ui/ButtonGroup';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { MetricChange } from '../charts/MetricChange';
import { Datepickers } from './Datepickers';
import { TimeLineChart } from '../Time/TimeLineChart';
import { FilmTableDetailed } from '../Time/FilmTableDetailed';
import { LastUpdated } from './LastUpdated';
import { StackedBarChart } from '../charts/StackedBarChart';
import { DatasourceCard } from './Datasource';
import { Card } from 'components/ui/Card';

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

type SkeletonProps = {
	children?: React.ReactNode;
};

/**
 * @description Skeleton loading components for loading state of the dashboard
 * @returns {JSX.Element}
 * @param {JSX.Element} children - Children components
 * @param {Object} props - Props passed to the component
 */
export const Skeleton = ({
	children,
	...props
}: SkeletonProps): JSX.Element => {
	return (
		<div className='skeleton animate-pulse transition ease-in-out' {...props}>
			{/* Skeleton Controls */}
			<div className='flex flex-wrap mb-2 animate-pulse gap-y-4 items-center justify-center'>
				<Datepickers />
				<ButtonGroup>
					<Button>1W</Button>
					<Button>1M</Button>
					<Button>3M</Button>
					<Button>1Y</Button>
				</ButtonGroup>
				<LastUpdated />
				<DatasourceCard />
			</div>

			<SkeletonCards />

			<SkeletonCharts />

			<div className='mt-3 md:mt-6'>
				<FilmTableDetailed data={[]} />
			</div>

			{children}
		</div>
	);
};