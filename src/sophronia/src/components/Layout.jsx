import { Outlet } from 'react-router-dom';
import { Sidebar } from './ui/Sidebar';
import { Footer } from './ui/Footer';
import { StructuredSiteData } from './StructuredData';
import { useEffect } from 'react';

export const Layout = () => {
	useEffect(() => {
		document.title = `UK Box Office Data`;
	}, []);

	return (
		<div className='fixed flex w-full h-full'>
			<StructuredSiteData />
			<Sidebar />

			<div className='flex-1 p-10 overflow-auto bg-gray-50 dark:bg-gray-900 dark:text-white'>
				<div className='h-max min-h-screen py-5'>
					<Outlet />
				</div>
				<Footer />
			</div>
		</div>
	);
};
