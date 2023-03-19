export const DescriptionList = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	return (
		<dl className='max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700 mb-4'>
			{children}
		</dl>
	);
};
