import { TimePage } from '../../../../../time';

export async function generateMetadata({
	params,
}: {
	params: { year: number; month: string; day: number };
}) {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	const m = parseInt(params.month);

	const title = `${params.day} ${months[m - 1]} ${
		params.year
	} | Box Office Data`;
	const description = `${params.day} ${months[m - 1]} ${
		params.year
	} | Box Office Data`;

	return {
		title: title,
		twitter: {
			title: title,
			description: description,
			card: 'summary',
			creator: '@AndyRae_',
			images: ['/icons/1.png'],
		},
		openGraph: {
			title: title,
			description: description,
			url: 'https://boxofficedata.co.uk',
			siteName: title,
			images: [
				{
					url: 'icons/1.png',
					width: 800,
					height: 600,
				},
			],
			locale: 'en-GB',
			type: 'website',
		},
	};
}

export default function Page({
	params,
}: {
	params: { year: number; month: number; day: number };
}) {
	return (
		<>
			<TimePage year={params.year} month={params.month} day={params.day} />
		</>
	);
}
