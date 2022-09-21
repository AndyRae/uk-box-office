import { Outlet } from 'react-router-dom';
import { Sidebar } from './ui/Sidebar';
import { Footer } from './ui/Footer';

export const Layout = () => {
	return (
		<div className='fixed flex w-full h-full'>
			<Sidebar />

			<div className='flex-1 p-10 overflow-auto bg-gray-50 dark:bg-gray-900 dark:text-white'>
				<div className='h-max'>
					<Outlet />
				</div>
				<Footer />
			</div>
		</div>
	);
};
