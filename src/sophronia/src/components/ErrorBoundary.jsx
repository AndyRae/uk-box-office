import React from 'react';

const ErrorMessage = ({ error }) => {
	return (
		<div>
			<h1 className='text-4xl font-bold py-5 capitalize'>
				An error has occurred.
			</h1>
			<div
				className='flex p-4 mb-4 text-sm max-w-lg text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800'
				role='alert'
			>
				<svg
					aria-hidden='true'
					className='flex-shrink-0 inline w-5 h-5 mr-3'
					fill='currentColor'
					viewBox='0 0 20 20'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						fill-rule='evenodd'
						d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
						clip-rule='evenodd'
					></path>
				</svg>
				<span className='sr-only'>Danger</span>
				<div>
					<span className='font-medium pb-5'>Sorry, something went wrong!</span>
					<p>Please try refreshing again in a moment</p>
				</div>
			</div>
		</div>
	);
};

export class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		// You can also log the error to an error reporting service
		// console.log(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return <ErrorMessage />;
		}

		return this.props.children;
	}
}
