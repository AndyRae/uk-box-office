export const MetricChange = ({ value }) => {
	const isNegative = value < 0;
	return (
		<span
			className={`${isNegative ? 'text-red-600' : 'text-green-600'} font-bold`}
		>
			{isNegative ? '' : '+'}
			{value}%
		</span>
	);
};
