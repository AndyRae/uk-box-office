export const MetricChange = ({ value }) => {
	const isNegative = value < 0;
	return (
		<span
			className={`${isNegative ? 'text-red-400' : 'text-green-400'} font-bold`}
		>
			{isNegative ? '' : '+'}
			{value}%
		</span>
	);
};
