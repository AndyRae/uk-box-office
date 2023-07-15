/**
 * @fileoverview This file contains the functions used to fetch data from the backend
 * @exports getApi
 *
 */

/**
 * Returns the backend URL based on the environment
 * @returns {string} The backend URL
 * @example
 * returns http://localhost:5000/api/
 */
export const getApi = (): string => {
	if (process.env.NEXT_PUBLIC_CODESPACE === 'true') {
		return `https://${process.env.NEXT_PUBLIC_CODESPACE_NAME}-5000.${process.env.NEXT_PUBLIC_GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}/api`;
	}

	if (process.env.NODE_ENV === 'development') {
		return 'http://localhost:5000/api';
	}

	return (
		process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.boxofficedata.co.uk/api'
	);
};
