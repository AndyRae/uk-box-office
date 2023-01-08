/**
 * @file ProgressBar.jsx
 * @description ProgressBar component to display page load progress.
 * @param {number} value - The active width of the progress bar in percentage
 * @returns {JSX.Element}
 * @example
 * <ProgressBar value={50} />
 */
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