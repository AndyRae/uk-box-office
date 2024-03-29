/**
 * @file PageTitle.jsx
 * @description PageTitle component for consistent styling.
 * @param {string} children - The text to display inside the button
 * @returns {JSX.Element}
 * @example
 * <PageTitle>Hello World!</PageTitle>
 */
export const PageTitle = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	return (
		<h1 className='text-2xl capitalize mb-10 font-bold tracking-tight text-gray-900 dark:text-white'>
			{children}
		</h1>
	);
};
