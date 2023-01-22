/**
 * @file Utility functions to group data for charts and tables.
 * @exports groupStackedFilms
 * @exports groupForTable
 * @exports groupbyDate
 * @exports groupbyMonth
 * @exports calculateWeek1Releases
 * @export calculateNumberOfFilms
 * @exports calculateNumberOfCinemas
 */

import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import flow from 'lodash/flow';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import countBy from 'lodash/countBy';

import { interpolateColors } from './colorGenerator';
import { interpolateSpectral } from 'd3-scale-chromatic';

/**
 * Groups data for a stacked bar chart.
 * @param {*} data array of box office data.
 * @returns Array of data sets objects for each film.
 */
export const groupStackedFilms = (data) => {
	const filmsLimit = 20; // Limit number of films to display

	// Reduce array to single films with box office
	const groupedFilms = flow(
		(arr) => groupBy(arr, 'film'),
		(groups) =>
			map(groups, (group, key) => ({
				film: key,
				slug: group[0].film_slug,
				weekGross: sumBy(group, 'week_gross'),
				weekendGross: sumBy(group, 'weekend_gross'),
			})),
		(arr) => sortBy(arr, 'weekGross').reverse(),
		(arr) => arr.slice(0, filmsLimit)
	)(data);

	// Interpolate colors
	const colorScale = interpolateSpectral;
	const colorRangeInfo = {
		colorStart: 0,
		colorEnd: 1,
		useEndAsStart: false,
	};
	var colors = interpolateColors(filmsLimit, colorScale, colorRangeInfo);

	// Create the dataset objects - one for each film
	const stackedData = groupedFilms.map((film, index) => {
		const filmData = data.filter((item) => item.film_slug === film.slug);
		const weekData = filmData.map((item) => {
			return { x: item.date, y: item.week_gross };
		});

		return {
			label: film.film,
			slug: film.slug,
			data: weekData,
			borderColor: colors[index],
			backgroundColor: colors[index],
			hoverBackgroundColor: '#000000',
			hoverBorderColor: '#000000',
			fill: false,
			tension: 0.3,
			pointStyle: 'line',
			pointRadius: 4,
			borderRadius: 4,
		};
	});

	return { stackedData };
};

/**
 * Groups box office data for tables.
 * @param {*} data array of box office data.
 * @returns Array of data sets objects for each film.
 * TODO: Refactor to use lodash - this is ancient.
 */
export const groupForTable = (data) => {
	// Grouping by film (and slug, distributor) - summing box office, max weeks.
	var table = data
		.reduce((acc, curr) => {
			let item = acc.find((x) => x.film === curr['film']);
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
 * Groups box office data by date.
 * @param {*} data array of box office data.
 * @returns array of grouped data by date.
 */
export const groupbyDate = (data) => {
	const results = flow(
		(arr) => groupBy(arr, 'date'),
		(arr) =>
			map(arr, (value, key) => ({
				date: key,
				weekGross: sumBy(value, 'week_gross'),
				weekendGross: sumBy(value, 'weekend_gross'),
				newReleases: countBy(value, (o) => o.weeks_on_release === 1).true,
			})).reverse()
	)(data);

	return { results };
};

/**
 * Groups box office by month.
 * @param {*} data
 * @returns array of grouped data by month.
 */
export const groupbyMonth = (data) => {
	const results = flow(
		(arr) => groupBy(arr, (o) => o.date.substring(0, 7)),
		(arr) =>
			map(arr, (value, key) => ({
				date: key,
				weekGross: sumBy(value, 'weekGross'),
				weekendGross: sumBy(value, 'weekendGross'),
				newReleases: sumBy(value, 'newReleases'),
			}))
	)(data);

	return { results };
};

/**
 * Calculates the number of week 1 releases.
 * @param {*} data array of box office data.
 * @returns number of week 1 releases.
 */
export const calculateWeek1Releases = (data) => {
	const week1 = data.filter((x) => x.weeks_on_release === 1);
	return week1.length;
};

/**
 * Calculates the number of unique films in the data.
 * @param {*} data - array of box office data.
 * @returns number of unique films.
 */
export const calculateNumberOfFilms = (data) => {
	const grouped = Array.from(data);
	const groupedNumber = Array.from(
		grouped.reduce(
			(m, { film, week_gross }) => m.set(film, (m.get(film) || 0) + week_gross),
			new Map()
		),
		([film, week_gross]) => ({ film, week_gross })
	);
	return groupedNumber.length;
};

/**
 * Calculates the total box office for the data.
 * @param {*} data - array of box office data.
 * @returns total box office.
 */
export const calculateNumberOfCinemas = (data) => {
	return Math.max.apply(
		Math,
		data.map(function (o) {
			return o.number_of_cinemas;
		})
	);
};
