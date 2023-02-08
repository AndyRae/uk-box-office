/**
 * Simple component to wrap content in a container for flatpages.
 * @param {children} children
 * @returns {JSX.Element}
 */
export const PageContent = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	return (
		<div className='flex flex-col max-w-xl space leading-7 space-between gap-4'>
			{children}
		</div>
	);
};
