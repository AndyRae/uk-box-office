'use client';

import { useState, setState } from 'react';
import { PageTitle } from 'components/ui/PageTitle';
import { getFilm } from 'app/film/[slug]/getFilm';
import { getBackendURL } from 'lib/ApiFetcher';
import { update } from 'lodash';

// async function SearchFilms(term: string) : Promise<string> {
async function SearchFilms(term) {
	const url = getBackendURL();
	const res = await fetch(`${url}search/film?q=${term}`);
	return res.json();
}

// export default function Page(): JSX.Element {
export default function Page() {
	// array of film ids

	// try to just load one film in.

	return (
		<>
			<PageTitle>Compare Films</PageTitle>
			<SearchFilm />
			{/* Typeahead box */}
		</>
	);
}

const SearchFilm = () => {
	const [term, setTerm] = useState('');
	const [suggestions, setSuggestions] = useState();

	const onTextChange = async (e) => {
		const value = e.target.value;
		setTerm(value);
		if (value.length > 0) {
			const results = await SearchFilms(value);
			setSuggestions(results);
			console.log(suggestions);
		}
	};

	const suggestionSelected = (value) => {
		console.log(value);
	};

	const renderSuggestions = () => {
		console.log('suggestions :', suggestions);
		if (suggestions.length === 0) {
			return null;
		}
		return (
			<ul>
				{suggestions.map((film) => (
					<li key={film.id} onClick={(e) => suggestionSelected(film.id)}>
						{film.name}
					</li>
				))}
			</ul>
		);
	};

	return (
		<>
			<input
				onChange={onTextChange}
				placeholder='Search film name'
				value={term}
				name='term'
				type='text'
				className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
			/>
			{renderSuggestions()}
		</>
	);
};
