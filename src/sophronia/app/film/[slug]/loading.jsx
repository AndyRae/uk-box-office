import Link from 'next/link';
import { BoxOfficeTable } from './BoxOfficeTable';
import { PageTitle } from 'components/ui/PageTitle';
import { Card } from 'components/ui/Card';
import { Date } from 'components/Date';
import { StructuredTimeData } from 'components/StructuredData';
import { DatasourceButton } from 'components/Dashboard/Datasource';
import { ExportCSV } from 'components/ui/ExportCSV';
import { TimeLineChart } from 'components/Time/TimeLineChart';
import { Spinner } from 'components/ui/Spinner';

export default function Loading() {
	return (
		<div>
			<PageTitle>-</PageTitle>

			<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5'>
				<Card title='Total Box Office' subtitle={`£ -`} />

				<Card title='Multiple' subtitle={`x -`} />

				<Card title={'Country'}>
					<ul className='flex flex-wrap justify-center'>-</ul>
				</Card>

				<Card title='Distributor'>
					<Link href={`#`}>
						<h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
							-
						</h5>
					</Link>
				</Card>
			</div>

			<div className='grid md:grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5 mt-3 md:mt-6'>
				<Card title='Weekly Box Office'>
					<TimeLineChart data={[]} />
				</Card>
				<Card title='Cumulative Box Office'>
					<TimeLineChart data={[]} color='#1E3A8A' allowRollUp={false} />
				</Card>
			</div>

			<div className='flex flex-row-reverse my-6'>
				<DatasourceButton />
				<ExportCSV data={[]} filename={`_data.csv`} />
			</div>

			<BoxOfficeTable data={[]} />
		</div>
	);
}
