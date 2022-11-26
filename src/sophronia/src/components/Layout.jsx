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
				<div className='px-4 pb-4 bg-bo-grey dark:bg-black dark:text-white'>
					<div className='h-max min-h-screen py-6'>
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
