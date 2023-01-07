'use client';

import { useFilm } from 'lib/films';
import { useEffect } from 'react';

export default function Page({ params }) {
	const { data, error } = useFilm(params.slug);

	// Unwrap first week date logic
	const weekOne = data.weeks[0];
	const weeksOnRelease = weekOne.weeks_on_release;
	const isFirstWeek = weeksOnRelease === 1 ? true : false;
	const releaseDate = weekOne.date;

	const multiple = (data.gross / weekOne.weekend_gross).toFixed(2);

	// Set the page title here as the data is fetched
	useEffect(() => {
		document.title = `${data?.name} - UK Box Office Data`;
	}, []);

	// Rename data to make it easy to reuse charts
	const cumulativeData = data.weeks.map(
		({ total_gross: week_gross, date }) => ({
			date,
			week_gross,
		})
	);

	return (
		<div>
			Film: {params.slug} {data.name}: {multiple}
		</div>
	);
}
