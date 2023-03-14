import Link from 'next/link';
import { BoxOfficeTable } from './BoxOfficeTable';
import { PageTitle } from 'components/ui/PageTitle';
import { Card } from 'components/ui/Card';
import { Date } from 'components/Date';
import { StructuredTimeData } from 'components/StructuredData';
import { DatasourceButton } from 'components/Dashboard/Datasource';
import { ExportCSV } from 'components/ui/ExportCSV';
import { TimeLineChart } from 'components/charts/TimeLineChart';
import { toTitleCase } from 'lib/utils/toTitleCase';

import { getFilm } from './getFilm';
import { BoxOfficeWeek } from 'interfaces/BoxOffice';

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}) {
	const data = await getFilm(params.slug);

	const year = data.weeks[0].date.split('-')[0];

	const description = `${toTitleCase(
		data.name
	)} (${year}) was released in the UK on ${
		data.weeks[0].date
	}, and grossed £${data.gross.toLocaleString()} at the UK Box Office.`;

	const title = `${toTitleCase(data.name)} ${year} | Box Office Data`;

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

const ListItem = ({ title, text }: { title: string; text: any }) => {
	return (
		<div className='flex flex-col pb-3'>
			<dt className='mb-1 text-gray-500 dark:text-gray-400'>{title}</dt>
			<dd className='font-semibold'>{text}</dd>
		</div>
	);
};

const BadgeLink = ({ text, link }: { text: string; link: string }) => {
	return (
		<Link
			href={link}
			className='text-bo-primary text-sm font-semibold mr-2 px-2.5 py-1 rounded-lg dark:bg-black dark:text-bo-primary border border-bo-primary bg-gradient-to-br from-transparent to-transparent hover:from-bo-primary hover:to-cyan-500 hover:text-white'
		>
			{text}
		</Link>
	);
};

export default async function Page({
	params,
}: {
	params: { slug: string };
}): Promise<JSX.Element> {
	const data = await getFilm(params.slug);

	// Unwrap first week date logic
	const weekOne = data.weeks[0];
	const weeksOnRelease = weekOne.weeks_on_release;
	const isFirstWeek = weeksOnRelease === 1 ? true : false;
	const releaseDate = weekOne.date;

	const multiple = (data.gross / weekOne.weekend_gross).toFixed(2);

	// Rename data to make it easy to reuse charts
	const cumulativeData: any[] = data.weeks.map(
		({ total_gross: week_gross, date }) => ({
			date,
			week_gross,
		})
	);

	return (
		<div>
			<StructuredTimeData
				title={`${data.name}`}
				endpoint={`/film/${params.slug}`}
				time={releaseDate}
			/>

			<div className='grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-5'>
				<div className='col-span-2'>
					<PageTitle>
						{toTitleCase(data.name)}{' '}
						{isFirstWeek && `(${releaseDate.split('-')[0]})`}
					</PageTitle>

					<dl className='max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700 mb-4'>
						<ListItem
							title={'Release Date'}
							text={<Date dateString={releaseDate} />}
						/>
						<ListItem
							title={'Total Box Office'}
							text={`£ ${data.gross.toLocaleString('en-GB')}`}
						/>
						<ListItem title={'Multiple'} text={`x${multiple}`} />
						<ListItem
							title={'Distributor'}
							text={
								<BadgeLink
									text={toTitleCase(data.distributor.name)}
									link={`/distributor/${data.distributor.slug}`}
								/>
							}
						/>
						<ListItem
							title={'Country'}
							text={data.countries.map((country) => {
								return (
									<BadgeLink
										key={country.id}
										text={country.name}
										link={`/country/${country.slug}`}
									/>
								);
							})}
						/>
						<ListItem
							title={'Compare'}
							text={
								<BadgeLink text={'Compare'} link={`/compare?id=${data.id}`} />
							}
						/>
					</dl>

					<DatasourceButton />
					{data.weeks && (
						<ExportCSV data={data.weeks} filename={`${data.name}_data.csv`} />
					)}
				</div>

				{/* Charts */}
				{data.weeks.length >= 2 && (
					<div className='col-span-3 flex flex-col gap-4 divide-y divide-gray-200 dark:divide-gray-700'>
						<div className='my-4'>
							<p className='font-bold text-sm text-gray-700 dark:text-gray-400'>
								Weekly Box Office
							</p>
							<TimeLineChart data={data.weeks} />
						</div>

						<div className='mb-8'>
							<p className='font-bold text-sm text-gray-700 dark:text-gray-400 mt-4'>
								Cumulative Box Office
							</p>
							<TimeLineChart
								data={cumulativeData}
								color='#1E3A8A'
								allowRollUp={false}
							/>
						</div>
					</div>
				)}
			</div>

			<BoxOfficeTable data={data} />
		</div>
	);
}
