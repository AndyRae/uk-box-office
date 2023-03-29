import { redirect } from 'next/navigation';
import { getApi } from 'lib/fetch/api';

async function getLastWeek(): Promise<{ results: { date: string }[] }> {
	const url = getApi();
	const res = await fetch(`${url}/boxoffice/all`, { cache: 'no-store' });
	return res.json();
}

/**
 * Get the last week from the API and redirects to that week.
 */
export default async function Page(): Promise<never> {
	const data = await getLastWeek();

	const lastWeek = data.results[0].date;
	const [year, month, day] = lastWeek.split('-');

	return redirect(`/time/${year}/m/${parseInt(month, 10)}/d/${day}`);
}
