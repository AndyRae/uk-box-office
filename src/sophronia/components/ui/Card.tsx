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

type Status =
	| 'default'
	| 'transparent'
	| 'warning'
	| 'success'
	| 'error'
	| string;
const statusStyle: { [key in Status]: string } = {
	default: 'bg-gray-100 dark:bg-gray-900 shadow-lg',
	transparent: 'bg-white dark:bg-black',
	success: 'bg-green-300 dark:bg-green-800/[.5] shadow-lg',
	warning: 'bg-yellow-300 dark:bg-yellow-500/[.5] shadow-lg',
	error: 'bg-red-300 dark:bg-red-800/[.5] shadow-lg',
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	title?: string;
	subtitle?: React.ReactNode;
	children?: React.ReactNode;
	size?: Size;
	align?: Align;
	status?: Status;
}

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
	className,
	size = 'md',
	align = 'center',
	status = 'default',
}: CardProps): JSX.Element => {
	return (
		<div
			className={clsx(
				'p-2 max-w-full rounded-lg',
				sizeStyle[size],
				alignStyle[align],
				statusStyle[status],
				className
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
