export const ProgressBar = ({ value }) => {
	return (
		<div className='w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700'>
			<div
				className={`h-1 rounded-full bg-bo-primary`}
				style={{
					width: `${value}%`,
					transition: 'width 0.1s ease-out',
				}}
			></div>
		</div>
	);
};
