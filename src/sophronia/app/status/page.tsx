import { PageTitle } from 'components/ui/PageTitle';
import { getEvents } from './getEvents';

export default async function Page(): Promise<JSX.Element> {
	const events = await getEvents();
	console.log(events);
	return (
		<>
			<PageTitle>Status</PageTitle>
			{events.ETL.message}
		</>
	);
}
