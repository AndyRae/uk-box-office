import { ButtonGroup } from '../ui/ButtonGroup';
import { Button } from '../ui/Button';
import { Card } from './Card';
import { Tooltip } from '../ui/Tooltip';
import { MetricChange } from '../charts/MetricChange';

export const SkeletonCards = () => {
	return (
		<div className='grid animate-pulse mb-2 md:grid-cols-2 lg:grid-cols-4 gap-4'>
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
		<div className='grid my-10 md:grid-cols-1 lg:grid-cols-2 gap-4'>
			<div className='p-4 rounded border border-gray-200 shadow animate-pulse dark:border-gray-700'>
				<div class='mb-10 h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>
				<div class='h-72 bg-gray-200 rounded-t-lg dark:bg-gray-700'></div>
			</div>
			<div className='p-4 rounded border border-gray-200 shadow animate-pulse dark:border-gray-700'>
				<div class='mb-10 h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>
				<div class='h-72 bg-gray-200 rounded-t-lg dark:bg-gray-700'></div>
			</div>
		</div>
	);
};

export const SkeletonTable = () => {
	return (
		<div className='p-4 rounded border border-gray-200 shadow animate-pulse dark:border-gray-700'>
			<div class='mb-10 h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>
			<div class='h-72 bg-gray-200 rounded-t-lg dark:bg-gray-700'></div>
		</div>
	);
};

export const Skeleton = ({ children, ...props }) => {
	return (
		<div className='skeleton animate-pulse' {...props}>
			{/* Skeleton Controls */}
			<div className='flex flex-wrap mb-2 animate-pulse items-center'>
				<div class='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-52 mb-2.5'></div>
				<div class='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-52 mb-2.5'></div>
				<ButtonGroup>
					<Button>1W</Button>
					<Button>1M</Button>
					<Button>3M</Button>
					<Button>1y</Button>
				</ButtonGroup>
				<div class='h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5'></div>
			</div>

			<SkeletonCards />

			<SkeletonCharts />

			<SkeletonTable />

			{children}
		</div>
	);
};
