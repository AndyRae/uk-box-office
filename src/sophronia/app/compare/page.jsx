'use client';

import { useState, setState, useEffect } from 'react';
import { PageTitle } from 'components/ui/PageTitle';
import { getFilm } from 'app/film/[slug]/getFilm';
import { getBackendURL } from 'lib/ApiFetcher';
import AsyncSelect from 'react-select/async';
import { Grid } from 'components/ui/Grid';
import { Card } from 'components/ui/Card';

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
	// array of film ids
	const [selectedFilms, setSelectedFilms] = useState(null);

	// array of complete film objects
	const [filmData, setFilmData] = useState();

	// get film data when added/removed
	useEffect(() => {
		let filmData = [];
		selectedFilms?.forEach(async (element) => {
			const data = await getFilm(element.value);
			filmData.push(data);
		});

		setFilmData(filmData);
	}, [selectedFilms]);

	// compare box office - table?

	return (
		<>
			<PageTitle>Compare Films</PageTitle>
			<AsyncSelect
				isMulti
				cacheOptions
				loadOptions={promiseOptions}
				onChange={setSelectedFilms}
			/>
			<Grid></Grid>
		</>
	);
}
