import { TimePage } from '../../../../time';

export async function generateMetadata({
	params,
}: {
	params: { year: string; quarter: string; quarterend: string };
}) {
	const title = `Q${params.quarter}-Q${params.quarterend} ${params.year} | Box Office Data`;
	const description = `Q${params.quarter}-Q${params.quarterend} ${params.year} | Box Office Data`;

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
	params: { year: number; quarter: number; quarterend: number };
}) {
	return (
		<>
			<TimePage
				year={params.year}
				quarter={params.quarter}
				quarterend={params.quarterend}
			/>
		</>
	);
}
