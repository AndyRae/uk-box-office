import React from 'react';

/**
 * Error message component
 * @description The error message to display when an error occurs.
 * @param {string} error - The error message.
 * @returns {JSX.Element}
 * @example
 * <ErrorMessage error='An error has occurred.' />
 */
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
				<span className='sr-only'>Danger</span>
				<div>
					<span className='font-medium pb-5'>Sorry, something went wrong!</span>
					<p>Please try refreshing again in a moment</p>
				</div>
			</div>
		</div>
	);
};

/**
 * Error boundary component
 * @description The error boundary component.
 * @returns {JSX.Element}
 */
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
