import clsx from 'clsx';

interface ChartWrapperProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
	title?: string;
	chartClassName?: string;
}

export const ChartWrapper = ({
	title,
	className,
	children,
	chartClassName,
}: ChartWrapperProps): JSX.Element => {
	return (
		<div className={className}>
			<ChartTitle>{title}</ChartTitle>
			<div className={chartClassName}>{children}</div>
		</div>
	);
};

const ChartTitle = ({ children }: ChartWrapperProps): JSX.Element => {
	return (
		<span className='font-bold text-sm text-gray-700 dark:text-gray-400'>
			{children}
		</span>
	);
};
