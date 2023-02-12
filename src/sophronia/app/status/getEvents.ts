import { getBackendURL } from 'lib/ApiFetcher';
import { Event } from 'interfaces/Event';

type EventsOverview = {
	Archived: Event;
	ETL: Event;
	Forecast: Event;
	latest: {
		count: number;
		next: string;
		previous: string;
		results: Event[];
	};
};

/**
 * Get the events overview.
 * @returns the events overview from the api.
 * @example
 * const events = await getEvents());
 */
export async function getEvents(): Promise<EventsOverview> {
	const url = getBackendURL();
	const res = await fetch(`${url}events`);
	return res.json();
}
