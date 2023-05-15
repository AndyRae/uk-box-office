'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageTitle } from 'components/ui/page-title';
import { getFilmId } from 'lib/fetch/films';
import { getApi } from 'lib/fetch/api';
import AsyncSelect from 'react-select/async';
import { CompareTable } from 'components/tables/compare-table';
import { CompareTotalChart } from 'components/charts/compare-total';
import { CompareCumulativeChart } from 'components/charts/compare-cumulative';
import { getDefaultColorArray } from 'lib/utils/colorGenerator';
import { ExportCSV } from 'components/ui/export-csv';
import { DatasourceButton } from 'components/datasource';
import { ChartWrapper } from 'components/charts/chart-wrapper';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import debounce from 'lodash/debounce';

type FilmOption = {
	value: string;
	label: string;
};

// Make the options search request
async function SearchFilms(term: string): Promise<FilmOption[]> {
	const url = getApi();
	const res = await fetch(`${url}/search/film?q=${term}`);
	return res.json();
}

// For parsing the options request response.
async function FilmsToOptions(term: string): Promise<FilmOption[]> {
	// Param Id can be present but empty.
	if (term != '') {
		const results = await SearchFilms(term);
		const parsed = results.map((film) => ({
			value: film.value,
			label: film.label,
		}));
		return parsed;
	}
	return [];
}

// Construct the promise for options.
const promiseOptions = (input: string): any =>
	new Promise((resolve) => {
		setTimeout(resolve, 250, FilmsToOptions(input));
	});

export const SearchFilters = () => {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();

	// array of complete film objects
	const [filmData, setFilmData] = useState<any[]>([]);

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
					const film = await getFilmId(Number(ids[i]));
					films.push({ value: film.id.toString(), label: film.name });
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
		var colors = getDefaultColorArray(data.length);

		let filmsData = [];
		for (let i = 0; i < data.length; i++) {
			const filmresp = await getFilmId(data[i].value);
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

	return (
		<div className='flex flex-wrap mb-2 gap-y-4 items-center justify-center'>
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
		</div>
	);
};
