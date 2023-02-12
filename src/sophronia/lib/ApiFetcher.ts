/**
 * @fileoverview This file contains the functions used to fetch data from the backend
 * @exports getBackendURL
 * @exports useBackendApi
 * @exports useInfiniteFetcher
 *
 */

import ky from 'ky';
import { useCallback } from 'react';

/**
 * Returns the backend URL based on the environment
 * @returns {string} The backend URL
 * @example
 * returns http://localhost:5000/api/
 */
export const getBackendURL = (): string => {
	if (process.env.NEXT_PUBLIC_CODESPACE === 'true') {
		return `https://${process.env.NEXT_PUBLIC_CODESPACE_NAME}-5000.${process.env.NEXT_PUBLIC_GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}/api/`;
	}

	if (process.env.NODE_ENV === 'development') {
		return 'http://localhost:5000/api/';
	}

	return (
		process.env.NEXT_PUBLIC_BACKEND_URL ||
		'https://api.boxofficedata.co.uk/api/'
	);
};

export const getBackendURLClient = (): string => {
	if (process.env.NEXT_PUBLIC_CODESPACE === 'true') {
		return `https://${process.env.NEXT_PUBLIC_CODESPACE_NAME}-5000.${process.env.NEXT_PUBLIC_GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}/api/`;
	}

	if (process.env.NODE_ENV === 'development') {
		return 'http://localhost:5000/api/';
	}

	return (
		process.env.NEXT_PUBLIC_BACKEND_URL ||
		'https://api.boxofficedata.co.uk/api/'
	);
};

/**
 * Returns a function that can be used to fetch data from the backend
 * Very simple implementation of ky / swr
 * @returns {function} A function that can be used to fetch data from the backend
 * @example
 * // returns { "message": "Hello World!" }
 */
export const useBackendApi = (): any => {
	const getBackendDefaults = () => ({
		prefixUrl: getBackendURLClient(),
	});

	const api = ky.create(getBackendDefaults());

	const apiFetcher = useCallback(
		async (path: string) => await api.get(path).json(),
		[api]
	);

	return apiFetcher;
};

/**
 * Common fetch function for use with useSWRInfinite
 * @param {string} url
 * @returns {object} The data from the backend
 * @example
 * // returns { "message": "Hello World!" }
 */
export async function useInfiniteFetcher(url: string): Promise<any> {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw { status: response.status, message: await response.json() };
		}
		return await response.json();
	} catch (err) {
		throw err;
	}
}
