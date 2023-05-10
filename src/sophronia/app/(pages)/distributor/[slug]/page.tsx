import { PageTitle } from 'components/ui/page-title';
import { DistributorFilmsTable } from 'components/tables/distributor-films-table';
import { PreviousChart } from 'components/charts/previous-chart';
import { DescriptionList } from 'components/ui/description-list';
import { DescriptionItem } from 'components/ui/description-item';
import { PreviousTable } from 'components/tables/previous-table';
import { StackedBarChart } from 'components/charts/stacked-bar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'components/ui/tabs';
import { DatasourceButton } from 'components/datasource';
import { ExportCSV } from 'components/ui/export-csv';
import { ChartWrapper } from 'components/charts/chart-wrapper';
import { Controls } from 'components/controls';

import {
	getDistributor,
	getDistributorBoxOffice,
} from 'lib/fetch/distributors';
import { fetchBoxOfficeInfinite } from 'lib/fetch/boxoffice';
import { parseDate } from 'lib/utils/dates';
import { toTitleCase } from 'lib/utils/toTitleCase';
import addDays from 'date-fns/addDays';

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
	searchParams: { p?: number; s?: string; e?: string };
}): Promise<JSX.Element> {
	let pageIndex = searchParams?.p ?? 1;
	const data = await getDistributor(params.slug);
	const boxOfficeData = await getDistributorBoxOffice(params.slug, 25);

	const boxOfficeTotal = boxOfficeData.results.reduce(
		(acc, curr) => acc + curr.total,
		0
	);
	const filmsCount = boxOfficeData.results.reduce(
		(acc, curr) => acc + curr.count,
		0
	);

	// Fetch box office data
	// Calculate defaults at 90 days.
	const s = parseDate(addDays(new Date(), -90));
	const e = parseDate(new Date());

	// Get dates from the searchparams.
	const start = searchParams?.s ?? s;
	const end = searchParams?.e ?? e;
	const { results } = await fetchBoxOfficeInfinite(start, end, data.id);

	return (
		<div>
			<div className='grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-5 mb-4 h-[30rem]'>
				<div className='col-span-2'>
					<PageTitle>{toTitleCase(data.name)}</PageTitle>
					<DescriptionList>
						<DescriptionItem
							title='Total Box Office'
							text={`£ ${boxOfficeTotal.toLocaleString('en-GB')}`}
						/>

						<DescriptionItem
							title='Number of Films'
							text={filmsCount.toLocaleString('en-GB')}
						/>
					</DescriptionList>

					<ExportCSV
						data={boxOfficeData.results}
						filename={`${data.name}_data.csv`}
						className='mr-2'
					/>
					<DatasourceButton />
				</div>

				<div className='col-span-3 h-full'>
					<Tabs defaultValue='tab1'>
						<TabsList>
							<TabsTrigger value='tab1'>Years</TabsTrigger>
							<TabsTrigger value='tab3'>Films</TabsTrigger>
							<TabsTrigger value='tab2'>Table</TabsTrigger>
						</TabsList>
						<TabsContent value='tab1'>
							<PreviousChart data={boxOfficeData.results} />
						</TabsContent>

						<TabsContent value='tab2'>
							<PreviousTable data={boxOfficeData.results} />
						</TabsContent>

						<TabsContent value='tab3'>
							<Controls start={start} end={end} />
							<ChartWrapper chartClassName='mt-6'>
								<StackedBarChart data={results} height='md' />
							</ChartWrapper>
						</TabsContent>
					</Tabs>
				</div>
			</div>

			<div className='mt-4'>
				{/* @ts-expect-error Server Component */}
				<DistributorFilmsTable slug={params.slug} pageIndex={pageIndex} />
			</div>
		</div>
	);
}
