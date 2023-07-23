import { redirect } from 'next/navigation';
import { fetchLastWeek } from 'lib/dataFetching';

/**
 * Get the last week from the API and redirects to that week.
 */
export default async function Page(): Promise<never> {
	const data = await fetchLastWeek();

	const lastWeek = data.results[0].date;
	const [year, month, day] = lastWeek.split('-');

	return redirect(`/time/${year}/m/${parseInt(month, 10)}/d/${day}`);
}
