import React from 'react';
import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Root } from './Routes';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import scrollToTop from './utils/scrollToTop';
import ScrollToTop from './utils/scrollToTop';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<StrictMode>
		<ErrorBoundary>
			<BrowserRouter>
				<Suspense fallback={<div background='#999999'>Loading...</div>}>
					<ScrollToTop />
					<Root />
				</Suspense>
			</BrowserRouter>
		</ErrorBoundary>
	</StrictMode>
);
