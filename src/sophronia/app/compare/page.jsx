'use client';

import { useState, setState } from 'react';
import { PageTitle } from 'components/ui/PageTitle';
import { getFilm } from 'app/film/[slug]/getFilm';
import { getBackendURL } from 'lib/ApiFetcher';
import AsyncSelect from 'react-select/async';

async function SearchFilms(term) {
	const url = getBackendURL();
	const res = await fetch(`${url}search/film?q=${term}`);
	return res.json();
}

async function FilmsToOptions(term) {
	const results = await SearchFilms(term);

	const parsed = results.map((film) => ({ value: film.id, label: film.name }));
	return parsed;
}

const promiseOptions = (inputValue) =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve(FilmsToOptions(inputValue));
		}, 1000);
	});

export default function Page() {
	// array of film ids

	// try to just load one film in.

	return (
		<>
			<PageTitle>Compare Films</PageTitle>
			{/* <SearchFilm /> */}
			<AsyncSelect isMulti cacheOptions loadOptions={promiseOptions} />
			{/* Typeahead box */}
		</>
	);
}
