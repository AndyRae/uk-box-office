/**
 * Simple grid component for wrapping content.
 * @param children - Children to wrap.
 * @returns
 */
export const Grid = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='grid md:grid-cols-2 mt-6 lg:grid-cols-4 gap-3 md:gap-5'>
			{children}
		</div>
	);
};
