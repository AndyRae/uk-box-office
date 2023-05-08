import { PageTitle } from 'components/ui/page-title';
import { CountryFilmsTable } from 'components/tables/country-films-table';
import { DescriptionList } from 'components/ui/description-list';
import { DescriptionItem } from 'components/ui/description-item';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'components/ui/tabs';
import { DatasourceButton } from 'components/datasource';
import { ExportCSV } from 'components/ui/export-csv';
import { PreviousChart } from 'components/charts/previous-chart';
import { PreviousTable } from 'components/tables/previous-table';

import { getCountry, getCountryBoxOffice } from 'lib/fetch/countries';

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
	const boxOffice = await getCountryBoxOffice(params.slug, 25);

	const total = boxOffice.results.reduce((acc, curr) => acc + curr.total, 0);

	return (
		<div>
			<PageTitle>{data.name}</PageTitle>

			<div className='grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-5 mb-5'>
				<div className='col-span-2 max-h-96'>
					<DescriptionList>
						<DescriptionItem
							title='Total Box Office'
							text={`£ ${total.toLocaleString('en-GB')}`}
						/>
					</DescriptionList>

					<ExportCSV
						data={boxOffice.results}
						filename={`${data.name}_data.csv`}
						className='mr-2'
					/>
					<DatasourceButton />
				</div>

				<div className='col-span-3'>
					<Tabs defaultValue='tab1'>
						<TabsList>
							<TabsTrigger value='tab1'>Chart</TabsTrigger>
							<TabsTrigger value='tab2'>Table</TabsTrigger>
						</TabsList>
						<TabsContent value='tab1'>
							<PreviousChart data={boxOffice.results} />
						</TabsContent>

						<TabsContent value='tab2'>
							<PreviousTable data={boxOffice.results} />
						</TabsContent>
					</Tabs>
				</div>
			</div>

			{/* @ts-expect-error Server Component */}
			<CountryFilmsTable slug={params.slug} pageIndex={pageIndex} />
		</div>
	);
}
