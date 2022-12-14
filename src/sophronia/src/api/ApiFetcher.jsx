/**
 * @fileoverview This file contains the functions used to fetch data from the backend
 * @exports getBackendURL
 * @exports useBackendApi
 * @exports useAxiosFetcher
 *
 */

import ky from 'ky';
import { useCallback } from 'react';
import axios from 'axios';

/**
 * Returns the backend URL based on the environment
 * @returns {string} The backend URL
 * @example
 * // returns http://localhost:5000/api/
 */
export const getBackendURL = () => {
	if (process.env.REACT_APP_CODESPACE === 'true') {
		return `https://${process.env.REACT_APP_CODESPACE_NAME}-5000.${process.env.REACT_APP_GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}/api/`;
	}

	if (process.env.NODE_ENV === 'development') {
		return 'http://localhost:5000/api/';
	}

	return process.env.REACT_APP_BACKEND_URL;
};

/**
 * Returns a function that can be used to fetch data from the backend
 * Very simple implementation of ky / swr
 * @returns {function} A function that can be used to fetch data from the backend
 * @example
 * // returns { "message": "Hello World!" }
 */
export const useBackendApi = () => {
	const getBackendDefaults = () => ({
		prefixUrl: getBackendURL(),
	});

	const api = ky.create(getBackendDefaults());

	const apiFetcher = useCallback(
		async (path) => await api.get(path).json(),
		[api]
	);

	return apiFetcher;
};

/**
 * Common axios fetch function for use with useSWRInfinite
 * @param {string} url
 * @returns {object} The data from the backend
 * @example
 * // returns { "message": "Hello World!" }
 */
export async function useAxiosFetcher(url) {
	try {
		return (await axios.get(url)).data;
	} catch (err) {
		throw { status: err.response.status, message: err.response.data };
	}
}
