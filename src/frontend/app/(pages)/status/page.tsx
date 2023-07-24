import { PageTitle } from 'components/ui/page-title';
import { fetchEvents } from 'lib/dataFetching';
import { EventsTable } from 'components/tables/events-table';
import { StatusCard } from 'components/status-card';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Status | Box Office Data',
};

export default async function Page(): Promise<JSX.Element> {
	// const events = await fetchEvents();

	return (
		<>
			{/* <PageTitle>Status</PageTitle>
			<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-3'>
				<StatusCard status={events.ETL} />
				<StatusCard status={events.Forecast} />
				<StatusCard status={events.Archive} />
			</div>

			<div className='mt-6'>
				<PageTitle>Logs</PageTitle>
				<EventsTable events={events.latest.results} />
			</div> */}
		</>
	);
}
