import { Metadata } from 'next';

import { fetchStatusEvents } from '@/lib/api/dataFetching';

import { PageTitle } from '@/components/custom/page-title';
import { StatusCard } from '@/components/status-card';
import { columns } from '@/components/tables/events';
import { DataTable } from '@/components/vendor/data-table';

export const metadata: Metadata = {
	title: 'Status | Box Office Data',
};

export default async function Page(): Promise<JSX.Element> {
	const events = await fetchStatusEvents();
	if (!events) {
		return <></>;
	}

	return (
		<>
			<PageTitle>Status</PageTitle>
			<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-3'>
				<StatusCard status={events.ETL} />
				<StatusCard status={events.Forecast} />
				<StatusCard status={events.Archive} />
			</div>

			<div className='mt-6'>
				<PageTitle>Logs</PageTitle>
				<DataTable columns={columns} data={events.latest.results} />
			</div>
		</>
	);
}
