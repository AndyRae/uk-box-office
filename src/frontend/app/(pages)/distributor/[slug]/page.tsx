import { PageTitle } from '@/components/custom/page-title';
import { PreviousChart } from '@/components/charts/previous-chart';
import { DescriptionList } from '@/components/custom/description-list';
import { DescriptionItem } from '@/components/custom/description-item';
import { StackedBarChart } from '@/components/charts/stacked-bar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DatasourceButton } from '@/components/datasource';
import { ExportCSV } from '@/components/custom/export-csv';
import { ChartWrapper } from '@/components/charts/chart-wrapper';
import { DashboardControls } from '@/components/controls';
import { DataTable } from '@/components/vendor/data-table';
import { FilmTable } from '@/components/tables/films';
import { columns as previousColumns } from '@/components/tables/historical';
import { Pagination } from '@/components/custom/pagination';

import {
	fetchDistributor,
	fetchDistributorBoxOffice,
	fetchDistributorFilms,
} from '@/lib/api/distributor';
import { fetchBoxOfficeInfinite } from '@/lib/api/dataFetching';
import { parseDate } from '@/lib/helpers/dates';
import { toTitleCase } from '@/lib/helpers/toTitleCase';
import { paginate } from '@/lib/helpers/pagination';
import addDays from 'date-fns/addDays';
import { FilmSortOption } from '@/interfaces/Film';

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}) {
	const data = await fetchDistributor(params.slug);

	const name = toTitleCase(data ? data?.name : '');
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
	searchParams: { p?: number; s?: string; e?: string; sort: FilmSortOption };
}): Promise<JSX.Element> {
	let pageIndex = searchParams?.p ?? 1;
	const sort = searchParams?.sort ?? 'asc_name';
	const data = await fetchDistributor(params.slug);
	const boxOfficeData = await fetchDistributorBoxOffice(params.slug, 25);

	const boxOfficeTotal = boxOfficeData?.results.reduce(
		(acc, curr) => acc + curr.total,
		0
	);
	const filmsCount = boxOfficeData?.results.reduce(
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
	const dist = data ? data.id : 0;
	const { results } = await fetchBoxOfficeInfinite(start, end, [dist]);

	// Add change YOY column
	const boxOfficeWithChange = boxOfficeData?.results.map((year, index) => {
		const previousYear = boxOfficeData.results[index + 1];
		const changeYOY = previousYear
			? Math.ceil(
					((year.total - previousYear.total) / previousYear.total) * 100
			  )
			: 0;
		return {
			change: changeYOY,
			...year,
		};
	});

	return (
		<div>
			<div className='grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-5 mb-4'>
				<div className='col-span-2'>
					<PageTitle>{toTitleCase(data ? data?.name : '')}</PageTitle>
					<DescriptionList>
						<DescriptionItem
							title='Total Box Office'
							text={`£ ${boxOfficeTotal?.toLocaleString('en-GB')}`}
						/>

						<DescriptionItem
							title='Number of Films'
							text={filmsCount?.toLocaleString('en-GB')}
						/>
					</DescriptionList>

					<ExportCSV
						data={boxOfficeData?.results}
						filename={`${data?.name}_data.csv`}
						className='mr-2'
					/>
					<DatasourceButton />
				</div>

				<div className='col-span-3 h-[35rem]'>
					<Tabs defaultValue='tab1'>
						<TabsList>
							<TabsTrigger value='tab1'>Years</TabsTrigger>
							<TabsTrigger value='tab2'>Films</TabsTrigger>
							<TabsTrigger value='tab3'>Historical</TabsTrigger>
						</TabsList>
						<TabsContent value='tab1' className='h-[30rem]'>
							{boxOfficeData && <PreviousChart data={boxOfficeData.results} />}
						</TabsContent>

						<TabsContent value='tab2' className='h-[30rem]'>
							<DashboardControls start={start} end={end} />
							<ChartWrapper chartClassName='mt-6'>
								<StackedBarChart data={results} height='md' />
							</ChartWrapper>
						</TabsContent>

						<TabsContent value='tab3' className='h-[30rem] overflow-scroll'>
							{boxOfficeWithChange && (
								<DataTable
									columns={previousColumns}
									data={boxOfficeWithChange}
								/>
							)}
						</TabsContent>
					</Tabs>
				</div>
			</div>

			<div className='mt-4'>
				<DistributorFilmsTable
					slug={params.slug}
					pageIndex={pageIndex}
					sort={sort}
				/>
			</div>
		</div>
	);
}

/**
 * @description Distributor Films List component
 * @param {String} slug - Distributor slug
 * @returns {JSX.Element}
 * @example
 * <DistributorFilmsList slug={slug} />
 */
const DistributorFilmsTable = async ({
	slug,
	pageIndex,
	sort,
}: {
	slug: string;
	pageIndex: number;
	sort: FilmSortOption;
}): Promise<JSX.Element> => {
	const pageLimit = 15;

	const data = await fetchDistributorFilms(slug, pageIndex, pageLimit, sort);

	const pageNumbers = data ? paginate(data.count, pageIndex, pageLimit) : [0];

	return (
		<>
			{data && <FilmTable data={data.results} />}
			<Pagination pages={pageNumbers} pageIndex={pageIndex} />
		</>
	);
};
