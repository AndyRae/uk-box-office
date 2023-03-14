export const ListItem = ({ title, text }: { title: string; text: any }) => {
	return (
		<div className='flex flex-col pb-3'>
			<dt className='mb-1 text-gray-500 dark:text-gray-400'>{title}</dt>
			<dd className='font-semibold'>{text}</dd>
		</div>
	);
};
