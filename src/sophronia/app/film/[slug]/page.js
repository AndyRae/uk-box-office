import { getBackendURL } from 'lib/ApiFetcher';

export async function getFilm(slug) {
	const url = getBackendURL();
	const res = await fetch(`${url}film/${slug}`, { cache: 'no-store' });
	return res.json();
}

export default async function Page({ params }) {
	const data = await getFilm(params.slug);

	// Unwrap first week date logic
	const weekOne = data.weeks[0];
	const weeksOnRelease = weekOne.weeks_on_release;
	const isFirstWeek = weeksOnRelease === 1 ? true : false;
	const releaseDate = weekOne.date;

	const multiple = (data.gross / weekOne.weekend_gross).toFixed(2);

	// Rename data to make it easy to reuse charts
	const cumulativeData = data.weeks.map(
		({ total_gross: week_gross, date }) => ({
			date,
			week_gross,
		})
	);

	return (
		<div>
			<br></br>
			Or: {data.slug} {data.name}: {multiple}
		</div>
	);
}
