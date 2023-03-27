import { getDistributor } from 'lib/fetch/distributors';
import { PageTitle } from 'components/ui/page-title';
import { DistributorFilmsTable } from 'components/tables/distributor-films-table';
import { toTitleCase } from 'lib/utils/toTitleCase';

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}) {
	const data = await getDistributor(params.slug);

	const title = `${data.name} | Box Office Data`;
	const description = `Get ${data.name} distributed films data at the UK Box Office.`;

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
	const data = await getDistributor(params.slug);

	return (
		<div>
			<PageTitle>{toTitleCase(data.name)}</PageTitle>
			{/* @ts-expect-error Server Component */}
			<DistributorFilmsTable slug={params.slug} pageIndex={pageIndex} />
		</div>
	);
}