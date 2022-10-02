/**
 * Utility functions to group data for charts and tables.
 */

/**
 * Groups data for the area chart.
 * @param {*} data array of box office data.
 * @returns
 */
export const groupForAreaChart = (data) => {
	// Reduce array to single films with box office
	const groupedArea = Array.from(data);
	let groupedFilms = Array.from(
		groupedArea.reduce(
			(m, { film, week_gross }) => m.set(film, (m.get(film) || 0) + week_gross),
			new Map()
		),
		([film, week_gross]) => ({ film, week_gross })
	);

	// Filter so we only graph the top N
	const topNFilms = 30;
	groupedFilms.sort(function (a, b) {
		return b.week_gross - a.week_gross;
	});
	groupedFilms.splice(topNFilms);

	var colors = [
		'#fe7e6d',
		'#fc9b89',
		'#f8b6a5',
		'#f2cfc0',
		'#ede7d8',
		'#d8d3e8',
		'#aeaae8',
		'#7f83de',
		'#4c61c6',
		'#17439b',
		'#fe7e6d',
		'#fc9b89',
		'#f8b6a5',
		'#f2cfc0',
		'#ede7d8',
		'#d8d3e8',
		'#aeaae8',
		'#7f83de',
		'#4c61c6',
		'#17439b',
		'#fe7e6d',
		'#fc9b89',
		'#f8b6a5',
		'#f2cfc0',
		'#ede7d8',
		'#d8d3e8',
		'#aeaae8',
		'#7f83de',
		'#4c61c6',
		'#17439b',
	];

	// Create the dataset objects - loop through the films, and then original results for matching weeks
	let datasets = [];
	for (let i in groupedFilms) {
		let randomColor = colors.shift();

		let x = {
			label: groupedFilms[i].film,
			borderColor: randomColor,
			fill: false,
		};

		let weeks = [];
		for (let j in data) {
			if (data[j].film == groupedFilms[i].film) {
				weeks.push({ x: data[j].date, y: data[j].week_gross });
			}
		}
		x.data = weeks;
		datasets.push(x);
	}
	return datasets;
};

/**
 * Groups box office data for tables.
 *
 * @param {*} data array of box office data.
 * @returns
 */
export const groupForTable = (data) => {
	// Grouping by film (and slug, distributor) - summing box office, max weeks.
	var table = data
		.reduce((acc, curr) => {
			let item = acc.find((x) => x.film == curr['film']);
			if (!item) {
				item = {
					film: curr['film'],
					slug: curr['film_slug'],
					distributor: curr['distributor'],
					weeks: {},
					weekend: {},
					cinemas: {},
				};
				acc.push(item);
			}
			// Prepare for statistic grouping
			item.weeks[curr.weeks_on_release] =
				(item.weeks[curr.weeks_on_release] || 0) + curr.week_gross;
			item.weekend[curr.weeks_on_release] =
				(item.weekend[curr.weeks_on_release] || 0) + curr.weekend_gross;
			item.cinemas[curr.number_of_cinemas] =
				(item.weekend[curr.number_of_cinemas] || 0) + curr.number_of_cinemas;
			return acc;
		}, [])
		.map((x) => ({
			title: x.film,
			filmSlug: x.slug,
			distributor: x.distributor,
			weeks: Math.max(...Object.keys(x.weeks).map(Number)),
			weekGross: Object.values(x.weeks).reduce((a, b) => a + b, 0),
			weekendGross: Object.values(x.weekend).reduce((a, b) => a + b, 0),
			numberOfCinemas: Math.max(...Object.keys(x.cinemas).map(Number)),
			siteAverage:
				Object.values(x.weeks).reduce((a, b) => a + b, 0) /
				Math.max(...Object.keys(x.cinemas).map(Number)),
		}));

	// Sort by box office
	const tableData = table.sort(function (a, b) {
		return b.weekGross - a.weekGross;
	});

	return { tableData };
};

/**
 * Groups box office data for line charts.
 * @param {*} data array of box office data.
 * @returns
 */
export const groupForLineChart = (data) => {
	const groupedDate = Array.from(data);
	return Array.from(
		groupedDate
			.reverse()
			.reduce(
				(m, { date, week_gross }) =>
					m.set(date, (m.get(date) || 0) + week_gross),
				new Map()
			),
		([date, week_gross]) => ({ date, week_gross })
	);
};
