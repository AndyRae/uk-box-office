import { fetchFilm } from '@/lib/api/dataFetching';
import { toTitleCase } from '@/lib/helpers/toTitleCase';

import { DescriptionList } from '@/components/custom/description-list';
import { PageTitle } from '@/components/custom/page-title';
import { badgeVariants } from '@/components/ui/badge';
import { DescriptionItem } from '@/components/custom/description-item';
import { Date } from '@/components/date';
import { StructuredTimeData } from '@/components/structured-data';
import { DatasourceButton } from '@/components/datasource';
import { ExportCSV } from '@/components/custom/export-csv';
import { TimeLineChart } from '@/components/charts/timeline';
import { ChartWrapper } from '@/components/charts/chart-wrapper';
import { columns, FilmWeek } from '@/components/tables/box-office';
import { DataTable } from '@/components/vendor/data-table';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';

import Link from 'next/link';

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}) {
	const data = await fetchFilm(params.slug);

	const year = data?.weeks[0]?.date.split('-')[0];

	const description = `${toTitleCase(
		data ? data.name : ''
	)} (${year}) was released in the UK on ${
		data?.weeks[0]?.date
	}, and grossed £${data?.gross.toLocaleString()} at the UK Box Office.`;

	const title = `${toTitleCase(
		data ? data.name : ''
	)} ${year} | Box Office Data`;

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
}: {
	params: { slug: string };
}): Promise<JSX.Element> {
	const data = await fetchFilm(params.slug);

	// Unwrap first week date logic
	const weekOne = data?.weeks[0];
	const weeksOnRelease = weekOne?.weeks_on_release;
	const isFirstWeek = !!(weeksOnRelease === 1);
	const releaseDate = weekOne ? weekOne.date : '';

	const multiple =
		data && weekOne ? (data.gross / weekOne?.weekend_gross).toFixed(2) : 0;

	// Rename data to make it easy to reuse charts
	const cumulativeData: any[] | undefined = data?.weeks.map(
		({ total_gross: week_gross, date }) => ({
			date,
			week_gross,
		})
	);

	const hasCountries = data ? data.countries.length > 0 : false;
	const hasDistributors = data ? data.distributors.length > 0 : false;

	const tableData: FilmWeek[] | undefined = data?.weeks.map(
		(week, index: number) => {
			const previousWeek = data.weeks[index - 1];
			const changeWeekend = previousWeek
				? Math.ceil(
						((week.weekend_gross - previousWeek.weekend_gross) /
							previousWeek.weekend_gross) *
							100
				  )
				: 0;

			return {
				week: week.weeks_on_release,
				date: week.date,
				rank: week.rank,
				cinemas: week.number_of_cinemas,
				weekendGross: week.weekend_gross,
				weekGross: week.week_gross,
				total: week.total_gross,
				siteAverage: week.site_average,
				changeWeekend: changeWeekend,
			};
		}
	);

	const Icon = Icons['compare'];

	return (
		<div>
			<StructuredTimeData
				title={`${data?.name}`}
				endpoint={`/film/${params.slug}`}
				time={releaseDate}
			/>

			<div className='grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-5 mb-4'>
				<div className='col-span-2'>
					<PageTitle>
						{toTitleCase(data ? data.name : '')}{' '}
						{isFirstWeek && `(${releaseDate?.split('-')[0]})`}
					</PageTitle>

					<DescriptionList>
						{weekOne && (
							<DescriptionItem
								title={'Release Date'}
								text={<Date dateString={releaseDate} />}
							/>
						)}

						<DescriptionItem
							title={'Total Box Office'}
							text={`£ ${data?.gross.toLocaleString('en-GB')}`}
						/>

						{weekOne && (
							<DescriptionItem title={'Multiple'} text={`x${multiple}`} />
						)}

						{hasDistributors && (
							<DescriptionItem
								title={'Distributors'}
								text={data?.distributors.map((distributor) => {
									return (
										<Link
											className={badgeVariants({ variant: 'default' })}
											href={`/distributor/${distributor.slug}`}
										>
											{toTitleCase(distributor.name)}
										</Link>
									);
								})}
							/>
						)}

						{hasCountries && (
							<DescriptionItem
								title={'Country'}
								text={data?.countries.map((country) => {
									return (
										<Link
											className={badgeVariants({ variant: 'default' })}
											href={`/country/${country.slug}`}
										>
											{toTitleCase(country.name)}
										</Link>
									);
								})}
							/>
						)}
					</DescriptionList>

					<Link
						className={buttonVariants({ variant: 'outline' })}
						href={`/compare?id=${data?.id}`}
					>
						<div className='px-1'>
							<Icon />
						</div>
						Compare
					</Link>

					{data?.weeks && (
						<ExportCSV
							data={data.weeks}
							filename={`${data.name}_data.csv`}
							className='mr-2 ml-2'
						/>
					)}
					<DatasourceButton />
				</div>

				{/* Charts */}
				{data && data.weeks.length >= 2 && (
					<div className='col-span-3 flex flex-col gap-4 divide-y divide-gray-200 dark:divide-gray-700'>
						<ChartWrapper title='Weekly Box Office' className='mb-4'>
							<TimeLineChart data={data.weeks} />
						</ChartWrapper>

						{cumulativeData && (
							<ChartWrapper title='Cumulative Box Office' className='py-4 mb-8'>
								<TimeLineChart
									data={cumulativeData}
									color='#1E3A8A'
									allowRollUp={false}
								/>
							</ChartWrapper>
						)}
					</div>
				)}
			</div>

			{tableData && <DataTable columns={columns} data={tableData} />}
		</div>
	);
}
