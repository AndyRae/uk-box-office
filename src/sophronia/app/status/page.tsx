import { PageTitle } from 'components/ui/PageTitle';
import { StatusEvent } from 'interfaces/Event';
import { getEvents } from './getEvents';
import { Card } from 'components/ui/Card';
import { EventsTable } from './EventsTable';

import { MdOutlineErrorOutline, MdCheckCircleOutline } from 'react-icons/md';

export default async function Page(): Promise<JSX.Element> {
	const events = await getEvents();
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
				<EventsTable events={events.latest.results} />
			</div>
		</>
	);
}

const StatusCard = ({ status }: { status: StatusEvent }): JSX.Element => {
	const icon =
		status.state.toString() === 'success' ? (
			<MdCheckCircleOutline />
		) : (
			<MdOutlineErrorOutline />
		);

	return (
		<Card
			title={status.area.toString()}
			subtitle={status.date}
			size='lg'
			status={status.state.toString()}
		>
			{icon} {status.message}
		</Card>
	);
};
