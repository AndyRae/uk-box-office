import { PageTitle } from 'components/ui/page-title';
import { DistributorFilmsTable } from 'components/tables/distributor-films-table';
import { PreviousYearsDistributorChart } from 'components/charts/previous-distributor';
import { DescriptionList } from 'components/ui/description-list';
import { DescriptionItem } from 'components/ui/description-item';
import { DistributorPreviousTable } from 'components/tables/distributor-previous-table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'components/ui/tabs';

import {
	getDistributor,
	getDistributorBoxOffice,
} from 'lib/fetch/distributors';
import { toTitleCase } from 'lib/utils/toTitleCase';

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}) {
	const data = await getDistributor(params.slug);

	const name = toTitleCase(data.name);
	const title = `${name} | Box Office Data`;
	const description = `Get ${name} distributed films data at the UK Box Office.`;

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
	const boxOffice = await getDistributorBoxOffice(params.slug, 25);

	const total = boxOffice.results.reduce((acc, curr) => acc + curr.total, 0);

	return (
		<div>
			<PageTitle>{toTitleCase(data.name)}</PageTitle>

			<div className='grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-5 mb-5'>
				<div className='col-span-2 max-h-96'>
					<DescriptionList>
						<DescriptionItem
							title='Total Box Office'
							text={`£ ${total.toLocaleString('en-GB')}`}
						/>
					</DescriptionList>
				</div>

				<div className='col-span-3'>
					<Tabs defaultValue='tab1'>
						<TabsList>
							<TabsTrigger value='tab1'>Chart</TabsTrigger>
							<TabsTrigger value='tab2'>Table</TabsTrigger>
						</TabsList>
						<TabsContent value='tab1'>
							<PreviousYearsDistributorChart data={boxOffice.results} />
						</TabsContent>

						<TabsContent value='tab2'>
							<DistributorPreviousTable data={boxOffice.results} />
						</TabsContent>
					</Tabs>
				</div>
			</div>

			{/* @ts-expect-error Server Component */}
			<DistributorFilmsTable slug={params.slug} pageIndex={pageIndex} />
		</div>
	);
}
