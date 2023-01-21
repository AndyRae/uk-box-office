import { redirect } from 'next/navigation';
import { getBackendURL } from 'lib/ApiFetcher';

async function getLastWeek() {
	const url = getBackendURL();
	const res = await fetch(`${url}boxoffice/all`);
	return res.json();
}

/**
 * Get the last week from the API and redirects to that week.
 */
export default async function Page() {
	const data = await getLastWeek();

	const lastWeek = data.results[0].date;
	const [year, month, day] = lastWeek.split('-');

	return redirect(`/time/${year}/m/${parseInt(month, 10)}/d/${day}`);
}
