type TooltipProps = {
	text: string;
	children: React.ReactNode;
};

/**
 * @file Tooltip.jsx
 * @description Simple Tooltip component to display a tooltip on hover.
 * @param {string} text - The text to display inside the tooltip
 * @returns {JSX.Element}
 * @example
 * <Tooltip text='Tooltip text'>
 * 	<span>Hover me</span>
 * </Tooltip>
 */
export const Tooltip = ({
	children,
	text,
	...props
}: TooltipProps): JSX.Element => {
	return (
		<div className='group' {...props}>
			<span className='tooltip-text text-sm font-medium shadow-md bg-slate-50 dark:bg-black dark:text-white p-1 -mt-12 -mr-10 rounded-lg hidden group-hover:block absolute text-center py-2 px-4 z-50'>
				{text}
			</span>
			{children}
		</div>
	);
};
