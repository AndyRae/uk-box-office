'use client';

import { useEffect } from 'react';

export default function Error({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div>
			<h1 className='text-4xl font-bold py-5 capitalize'>
				An error has occurred.
			</h1>
			<div
				className='flex p-4 mb-4 text-sm max-w-lg text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800'
				role='alert'
			>
				<span className='sr-only'>Danger</span>
				<div>
					<span className='font-medium pb-5'>Sorry, something went wrong!</span>
					<p>
						Please try refreshing again in a moment, or try a different page.
					</p>
				</div>
			</div>
			<button onClick={() => reset()}>Reset.</button>
		</div>
	);
}
