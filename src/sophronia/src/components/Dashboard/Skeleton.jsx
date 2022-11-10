import { ButtonGroup } from '../ui/ButtonGroup';
import { Button } from '../ui/Button';
import { Card } from './Card';
import { Tooltip } from '../ui/Tooltip';
import { MetricChange } from '../charts/MetricChange';
import { Datepickers } from './Datepickers';
import { TimeLineChart } from '../Time/TimeLineChart';
import { FilmTable } from '../Time/FilmTable';

export const SkeletonCards = () => {
	return (
		<div className='grid animate-pulse md:grid-cols-2 mt-10 lg:grid-cols-4 gap-4'>
			<Card title='Total Box Office' subtitle='-'>
				<Tooltip text='Change from last year'>
					<MetricChange value='' />{' '}
				</Tooltip>
			</Card>

			<Card title='Weekend Box Office' subtitle='-'>
				<Tooltip text='Change from last year'>
					{' '}
					<MetricChange value='' />{' '}
				</Tooltip>
			</Card>

			<Card title='New Releases' subtitle='-'>
				<Tooltip text='Change from last year'>
					{' '}
					<MetricChange value='' />{' '}
				</Tooltip>
			</Card>

			<Card title='New Releases' subtitle='-'>
				<Tooltip text='Change from last year'>
					{' '}
					<MetricChange value='' />{' '}
				</Tooltip>
			</Card>
		</div>
	);
};

export const SkeletonCharts = () => {
	return (
		<div className='grid md:grid-cols-1 lg:grid-cols-2 mt-10 gap-4'>
			<div className='animate-pulse shadow'>
				<TimeLineChart data={[]} />
			</div>
			<div className='animate-pulse shadow'>
				<TimeLineChart data={[]} />
			</div>
		</div>
	);
};

export const SkeletonTable = () => {
	return (
		<div className='p-4 rounded border border-gray-200 shadow animate-pulse dark:border-gray-700'>
			<div className='mb-10 h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>
			<div className='h-72 bg-gray-200 rounded-t-lg dark:bg-gray-700'></div>
		</div>
	);
};

export const Skeleton = ({ children, ...props }) => {
	return (
		<div className='skeleton animate-pulse transition ease-in-out' {...props}>
			{/* Skeleton Controls */}
			<div className='flex flex-wrap mb-2 animate-pulse items-center justify-center'>
				<Datepickers />
				<ButtonGroup>
					<Button>1W</Button>
					<Button>1M</Button>
					<Button>3M</Button>
					<Button>1y</Button>
				</ButtonGroup>
				<div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5'></div>
				<div className='text-sm md:ml-auto pt-4'>Last Updated: --------</div>
			</div>

			<SkeletonCards />

			<SkeletonCharts />

			<FilmTable data={[]} />

			{children}
		</div>
	);
};
