import ky from 'ky';
import { useCallback } from 'react';
import axios from 'axios';

/**
 * Builds a very simple fetcher instance for SWR
 */
export const useBackendApi = () => {
	const getBackendURL = () => {
		return `${process.env.BACKEND_URL || 'http://localhost:5000/api2/'}`;
	};

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

// Common axios fetch function for use with useSWRInfinite
export async function useAxiosFetcher(url) {
	try {
		return (await axios.get(url)).data;
	} catch (err) {
		throw { status: err.response.status, message: err.response.data };
	}
}
