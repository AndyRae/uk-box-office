export const ListItem = ({
	title,
	text,
	children,
}: {
	title: string;
	text: any;
	children?: React.ReactNode;
}) => {
	return (
		<div className='flex flex-col pb-3'>
			<dt className='mb-1 text-gray-500 dark:text-gray-400'>{title}</dt>
			<dd className='font-semibold'>{text}</dd>
			<dd>{children}</dd>
		</div>
	);
};
