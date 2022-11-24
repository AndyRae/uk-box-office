import { Outlet } from 'react-router-dom';
import { Sidebar } from './ui/Sidebar';
import { Footer } from './ui/Footer';
import { StructuredSiteData } from './StructuredData';
import { useEffect } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { useLocation } from 'react-router-dom';

export const Layout = () => {
	const location = useLocation();

	useEffect(() => {
		document.title = `UK Box Office Data`;
	}, []);

	return (
		<div>
			<StructuredSiteData />
			<Sidebar>
				{/* <div className='p-4 bg-gray-50 dark:bg-gray-900 dark:text-white'> */}
				<div className='p-4 bg-gray-50 dark:bg-black dark:text-white'>
					<div className='h-max min-h-screen py-10'>
						<ErrorBoundary key={location.pathname}>
							<Outlet />
						</ErrorBoundary>
					</div>
					<Footer />
				</div>
			</Sidebar>
		</div>
	);
};
