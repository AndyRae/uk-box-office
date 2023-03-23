import { PageTitle } from 'components/ui/page-title';
import { CountryFilmsTable } from 'components/tables/country-films-table';
import { getCountry } from 'lib/countries';

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}) {
	const data = await getCountry(params.slug);

	const title = `${data.name} | Box Office Data`;
	const description = `Get ${data.name} released films data at the UK Box Office.`;

	return {
		title: title,
		description: description,
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

export default async function Page({
	params,
	searchParams,
}: {
	params: { slug: string };
	searchParams: { p?: number };
}): Promise<JSX.Element> {
	let pageIndex = searchParams?.p ?? 1;
	const data = await getCountry(params.slug);

	return (
		<div>
			<PageTitle>{data.name}</PageTitle>
			{/* @ts-expect-error Server Component */}
			<CountryFilmsTable slug={params.slug} pageIndex={pageIndex} />
		</div>
	);
}
