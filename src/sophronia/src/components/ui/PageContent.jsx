/**
 * So far just for Flatpages
 * @param {children} children
 * @returns
 */
export const PageContent = ({ children }) => {
	return (
		<div className='flex flex-col max-w-xl space leading-7 space-between gap-4'>
			{children}
		</div>
	);
};
