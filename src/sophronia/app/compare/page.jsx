'use client';

import { useState, useEffect } from 'react';
import { PageTitle } from 'components/ui/PageTitle';
import { getFilmId } from 'app/film/[slug]/getFilm';
import { getBackendURL } from 'lib/ApiFetcher';
import AsyncSelect from 'react-select/async';
import { CompareTable } from './CompareTable';
import { CompareTotalChart } from './CompareTotalChart';
import { CompareCumulativeChart } from './CompareCumulativeChart';
import { Card } from 'components/ui/Card';
import { getDefaultColorArray } from 'lib/utils/colorGenerator';
import { ExportCSV } from 'components/ui/ExportCSV';
import { DatasourceButton } from 'components/Dashboard/Datasource';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

async function SearchFilms(term) {
	const url = getBackendURL();
	const res = await fetch(`${url}search/film?q=${term}`);
	return res.json();
}

async function FilmsToOptions(term) {
	const results = await SearchFilms(term);

	const parsed = results.map((film) => ({
		value: film.value,
		label: film.label,
	}));
	return parsed;
}

const promiseOptions = (inputValue) =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve(FilmsToOptions(inputValue));
		}, 100);
	});

export default function Page() {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();

	// array of complete film objects
	const [filmData, setFilmData] = useState([]);

	// array of Ids set by the select.
	const [filmIds, setFilmIds] = useState([]);

	// array of Id data -
	const [filmIdData, setFilmIdData] = useState([]);

	// Run on start to set state if film Ids exist.
	useEffect(() => {
		const ids = searchParams.get('id')?.split(',');

		let films = [];
		async function fetchData() {
			for (let i = 0; i < ids?.length; i++) {
				const film = await getFilmId(ids[i]);
				films.push({ value: film.id.toString(), label: film.name });
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

	async function getFilmData(data) {
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
	const handleOptionChange = async (data) => {
		setFilmIds(data);
		getFilmData(data);

		// Add Ids to the url
		const urlIds = data.map((film) => film.value);
		router.replace(pathName + `?id=${urlIds}`);
	};

	return (
		<>
			<PageTitle>Compare Films</PageTitle>
			<AsyncSelect
				isMulti
				cacheOptions
				defaultOptions={true}
				loadOptions={promiseOptions}
				onChange={handleOptionChange}
				className='compare-select-container'
				classNamePrefix='compare-select'
				value={filmIds}
			/>

			{filmData.length > 0 && (
				<>
					<div className='flex flex-row-reverse my-6'>
						<DatasourceButton />
						<ExportCSV data={filmData} filename={'comparison_data.csv'} />
					</div>

					<div className='mt-6'>
						<CompareTable data={filmData} />
					</div>

					<div className='grid md:grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5 mt-3 md:mt-6'>
						<Card title='Weekly Box Office'>
							<CompareTotalChart data={filmData} />
						</Card>
						<Card title='Cumulative Box Office'>
							<CompareCumulativeChart data={filmData} />
						</Card>
					</div>
				</>
			)}
		</>
	);
}
