/**
 * @file Spinner.jsx
 * @description Spinner component to display while page is loading.
 * @returns {JSX.Element}
 * @example
 * <Spinner />
 * @see https://tailwindcss.com/docs/animation
 */
export const Spinner = () => {
	return (
		<div className='flex justify-center items-center h-screen'>
			<div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-bo-primary'></div>
		</div>
	);
};
