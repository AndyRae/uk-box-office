'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageTitle } from '@/components/custom/page-title';
import { fetchFilmId } from '@/lib/api/dataFetching';

import AsyncSelect from 'react-select/async';
import { CompareTable } from '@/components/tables/compare-table';
import { CompareTotalChart } from '@/components/charts/compare-total';
import { CompareCumulativeChart } from '@/components/charts/compare-cumulative';
import { getDefaultColorArray } from '@/lib/helpers/colorGenerator';
import { ExportCSV } from '@/components/custom/export-csv';
import { DatasourceButton } from '@/components/datasource';
import { ChartWrapper } from '@/components/charts/chart-wrapper';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import debounce from 'lodash/debounce';
import { FilmOption, FilmWithWeeks } from '@/interfaces/Film';
import { fetchSearchFilms } from '@/lib/api/dataFetching';
import { DataTable } from '@/components/vendor/data-table';
import { FilmCompare, columns } from '@/components/tables/compare';
import { calculateNumberOfCinemas } from '@/lib/helpers/groupData';
import { toTitleCase } from '@/lib/helpers/toTitleCase';

// For parsing the options request response.
async function FilmsToOptions(term: string): Promise<FilmOption[]> {
	// Param Id can be present but empty.
	if (term != '') {
		const results = await fetchSearchFilms(term);
		return results.map((film) => ({
			value: film.value,
			label: toTitleCase(film.label),
		}));
	}
	return [];
}

// Construct the promise for options.
const promiseOptions = (input: string): any =>
	new Promise((resolve) => {
		setTimeout(resolve, 250, FilmsToOptions(input));
	});

export default function Page(): JSX.Element {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();

	// array of complete film objects
	const [filmData, setFilmData] = useState<FilmWithWeeks[]>([]);

	// array of Ids set by the select.
	const [filmIds, setFilmIds] = useState<FilmOption[]>([]);

	// array of Id data -
	const [filmIdData, setFilmIdData] = useState<FilmOption[]>([]);

	// debounce for the options search
	const loadOptions = useCallback(
		debounce((inputText, callback) => {
			promiseOptions(inputText).then((options: FilmOption[]) =>
				callback(options)
			);
		}, 300),
		[]
	);

	// Run on start to set state if film Ids exist.
	useEffect(() => {
		const ids = searchParams.get('id')?.split(',').filter(Boolean);

		let films: FilmOption[] = [];
		async function fetchData() {
			if (ids) {
				for (let i = 0; i < ids?.length; i++) {
					const film = await fetchFilmId(Number(ids[i]));
					films.push({
						value: film.id.toString(),
						label: toTitleCase(film.name),
					});
				}
			}
			setFilmIdData(films);
		}
		fetchData();
	}, []);

	// Run if film Ids exist to fetch data
	useEffect(() => {
		setFilmIds(filmIdData);
		getFilmData(filmIdData);
	}, [filmIdData]);

	async function getFilmData(data: any) {
		// Interpolate colors
		let colors = getDefaultColorArray(data.length);

		let filmsData = [];
		for (let i = 0; i < data.length; i++) {
			const filmresp = await fetchFilmId(data[i].value);
			filmresp.color = colors.shift();
			filmsData.push(filmresp);
		}

		setFilmData([...filmsData]);
	}

	// Fetch data when an option is selected
	const handleOptionChange = async (data: any) => {
		setFilmIds(data);
		getFilmData(data);

		// Add Ids to the url
		const urlIds = data.map((film: FilmOption) => film.value);
		router.push(pathName + `?id=${urlIds}`);
	};

	const tableData: FilmCompare[] = filmData.map((film) => {
		const weekOne = film.weeks[0];
		const releaseDate = weekOne?.date;

		const multiple = (film.gross / weekOne?.weekend_gross).toFixed(2);
		const cinemas = calculateNumberOfCinemas(film.weeks);
		const siteAverage = film.gross / cinemas;
		return {
			color: film.color,
			title: toTitleCase(film.name),
			release: releaseDate,
			distributor: film.distributors,
			total: film.gross,
			weeks: film.weeks.length,
			multiple: multiple,
			cinemas: cinemas,
			siteAverage: siteAverage,
		};
	});

	return (
		<>
			<PageTitle>Compare Films</PageTitle>
			<AsyncSelect
				isMulti
				cacheOptions
				loadOptions={loadOptions}
				onChange={handleOptionChange}
				className='compare-select-container'
				classNamePrefix='compare-select'
				value={filmIds}
				inputId='compare-select'
				instanceId='compare-select'
				noOptionsMessage={() => 'Search for films...'}
			/>

			{filmData.length > 0 && (
				<>
					<div className='flex flex-row-reverse my-6'>
						<DatasourceButton />
						<ExportCSV
							data={filmData}
							filename={'comparison_data.csv'}
							className='mr-2'
						/>
					</div>

					<div className='mt-6'>
						<DataTable columns={columns} data={tableData} />
					</div>

					<div className='mt-6'>
						<CompareTable data={filmData} />
					</div>

					<div className='grid md:grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5 mt-3 md:mt-6'>
						<ChartWrapper title='Weekly Box Office'>
							<CompareTotalChart data={filmData} />
						</ChartWrapper>

						<ChartWrapper title='Cumulative Box Office'>
							<CompareCumulativeChart data={filmData} />
						</ChartWrapper>
					</div>
				</>
			)}
		</>
	);
}
