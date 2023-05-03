interface DescriptionItemProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	text: any;
}

export const DescriptionItem = ({
	title,
	text,
	children,
}: DescriptionItemProps) => {
	return (
		<div className='flex flex-col pb-3'>
			<dt className='mb-1 text-gray-500 dark:text-gray-400'>{title}</dt>
			<dd className='font-semibold'>{text}</dd>
			<dd>{children}</dd>
		</div>
	);
};
