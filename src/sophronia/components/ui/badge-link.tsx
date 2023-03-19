import Link from 'next/link';

export const BadgeLink = ({
	text,
	link,
}: {
	text: string;
	link: string;
}): JSX.Element => {
	return (
		<Link
			href={link}
			className='text-bo-primary text-sm font-semibold mr-2 px-2.5 py-1 rounded-lg dark:bg-black dark:text-bo-primary border border-bo-primary bg-gradient-to-br from-transparent to-transparent hover:from-bo-primary hover:to-cyan-500 hover:text-white'
		>
			{text}
		</Link>
	);
};
