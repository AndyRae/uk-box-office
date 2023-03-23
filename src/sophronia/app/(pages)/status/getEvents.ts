import { getApi } from 'lib/api';
import { StatusEvent } from 'interfaces/Event';

type EventsOverview = {
	Archive: StatusEvent;
	ETL: StatusEvent;
	Forecast: StatusEvent;
	latest: {
		count: number;
		next: string;
		previous: string;
		results: StatusEvent[];
	};
};

/**
 * Get the events overview.
 * @returns the events overview from the api.
 * @example
 * const events = await getEvents());
 */
export async function getEvents(): Promise<EventsOverview> {
	const url = getApi();
	const res = await fetch(`${url}/events`);
	return res.json();
}
