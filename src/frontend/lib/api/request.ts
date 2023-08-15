import { getApi } from './endpoints';

// Error class for API errors
class APIError extends Error {
	constructor(message: string, status: number) {
		super(message);
		this.name = 'APIError';
	}
}

interface RequestOptions {
	method?: string;
	headers?: HeadersInit;
	body?: BodyInit;
	cache?: RequestCache;
	next?: { revalidate: number };
}

const defaultHeaders: HeadersInit = {
	'Content-Type': 'application/json',
};

const request = async <T>(
	url: string,
	options: RequestOptions = {}
): Promise<T> => {
	try {
		const response = await fetch(getApi() + url, {
			method: options.method || 'GET',
			headers: { ...defaultHeaders, ...options.headers },
			body: options.body,
			cache: options.cache,
			next: options.next,
		});

		if (!response.ok) {
			const errorMessage = await response.text();
			throw new APIError(errorMessage, response.status);
		}

		return response.json();
	} catch (error) {
		throw new APIError('Failed to fetch data', 500);
	}
};

export default request;
