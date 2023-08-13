'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageTitle } from '@/components/ui/page-title';
import { fetchFilmId } from '@/lib/dataFetching';

import AsyncSelect from 'react-select/async';
import { CompareTable } from '@/components/tables/compare-table';
import { CompareTotalChart } from '@/components/charts/compare-total';
import { CompareCumulativeChart } from '@/components/charts/compare-cumulative';
import { getDefaultColorArray } from '@/lib/helpers/colorGenerator';
import { ExportCSV } from '@/components/ui/export-csv';
import { DatasourceButton } from '@/components/datasource';
import { ChartWrapper } from '@/components/charts/chart-wrapper';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import debounce from 'lodash/debounce';
import { FilmOption } from 'interfaces/Film';
import { fetchSearchFilms } from '@/lib/dataFetching';

// For parsing the options request response.
async function FilmsToOptions(term: string): Promise<FilmOption[]> {
	// Param Id can be present but empty.
	if (term != '') {
		const results = await fetchSearchFilms(term);
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

export default function Page(): JSX.Element {
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
					const film = await fetchFilmId(Number(ids[i]));
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
