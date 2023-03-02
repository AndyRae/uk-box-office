'use client';

import { useState, setState, useEffect } from 'react';
import { PageTitle } from 'components/ui/PageTitle';
import { getFilm } from 'app/film/[slug]/getFilm';
import { getBackendURL } from 'lib/ApiFetcher';
import AsyncSelect from 'react-select/async';
import { CompareTable } from './CompareTable';
import { CompareTotalChart } from './CompareTotalChart';
import { CompareCumulativeChart } from './CompareCumulativeChart';
import { Card } from 'components/ui/Card';
import { getDefaultColorArray } from 'lib/utils/colorGenerator';

async function SearchFilms(term) {
	const url = getBackendURL();
	const res = await fetch(`${url}search/film?q=${term}`);
	return res.json();
}

async function FilmsToOptions(term) {
	const results = await SearchFilms(term);

	const parsed = results.map((film) => ({
		value: film.slug,
		label: film.name,
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
	// array of complete film objects
	const [filmData, setFilmData] = useState(null);

	// array of Ids - might not be needed.
	const [filmIds, setFilmIds] = useState([]);

	const handleOptionChange = async (data) => {
		setFilmIds(data);

		// Interpolate colors
		var colors = getDefaultColorArray(data.length);

		let filmsData = [];
		for (let i = 0; i < data.length; i++) {
			const filmresp = await getFilm(data[i].value);
			filmresp.color = colors.shift();
			filmsData.push(filmresp);
		}

		setFilmData([...filmsData]);
	};

	const classNames = {
		control: (state) =>
			state.isFocused ? 'border-red-600' : 'border-grey-300',
	};

	return (
		<>
			<PageTitle>Compare Films</PageTitle>
			<AsyncSelect
				isMulti
				cacheOptions
				defaultOptions={false}
				loadOptions={promiseOptions}
				onChange={handleOptionChange}
				className='compare-select-container'
				classNamePrefix='compare-select'
			/>

			<div className='mt-6'>{filmData && <CompareTable data={filmData} />}</div>

			{filmData && (
				<div className='grid md:grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5 mt-3 md:mt-6'>
					<Card title='Weekly Box Office'>
						<CompareTotalChart data={filmData} />
					</Card>
					<Card title='Cumulative Box Office'>
						<CompareCumulativeChart data={filmData} />
					</Card>
				</div>
			)}
		</>
	);
}
