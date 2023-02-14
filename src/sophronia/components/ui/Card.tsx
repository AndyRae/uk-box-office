import clsx from 'clsx';

type Size = 'sm' | 'md' | 'lg';
const sizeStyle: { [key in Size]: string } = {
	sm: 'md:py-3 md:px-6',
	md: 'md:p-6',
	lg: '',
};

type Align = 'left' | 'center' | 'right';
const alignStyle: { [key in Align]: string } = {
	left: 'text-left',
	center: 'text-center',
	right: 'text-right',
};

type Status = 'default' | 'warning' | 'success' | 'error' | string;
const statusStyle: { [key in Status]: string } = {
	default: 'bg-white dark:bg-gray-900',
	success: 'bg-green-300 dark:bg-green-800/[.5]',
	warning: 'bg-yellow-300 dark:bg-yellow-500/[.5]',
	error: 'bg-red-300 dark:bg-red-800/[.5]',
};

type CardProps = {
	title?: string;
	subtitle?: React.ReactNode;
	children?: React.ReactNode;
	size?: Size;
	align?: Align;
	status?: Status;
};

/**
 * @file Card.jsx
 * @description Card component for dashboard
 * @returns {JSX.Element}
 * @example <Card title="Box Office" subtitle="£ 1,000" size="lg" />
 */
export const Card = ({
	title,
	subtitle,
	children,
	size = 'md',
	align = 'center',
	status = 'default',
}: CardProps): JSX.Element => {
	return (
		<div
			className={clsx(
				'p-2 max-w-full rounded-lg shadow-lg',
				sizeStyle[size],
				alignStyle[align],
				statusStyle[status]
			)}
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
