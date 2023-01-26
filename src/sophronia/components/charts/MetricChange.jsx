/**
 * @fileoverview MetricChange component
 * Returns a metric with green/red color based on the value.
 * @param {Number} value - Value to be displayed
 * @returns {JSX.Element}
 * @example
 * <MetricChange value={1} />
 */
export const MetricChange = ({ value }) => {
	const isNegative = value < 0;
	return (
		<span
			className={`${
				isNegative
					? 'text-red-400'
					: 'text-bo-metric-green dark:text-green-400 '
			} font-bold`}
		>
			{isNegative ? '' : '+'}
			{value}%
		</span>
	);
};
