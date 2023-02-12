// These styles apply to every route in the application
import './globals.css';
import { Sidebar } from 'components/ui/Sidebar';
import { Footer } from 'components/ui/Footer';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	return (
		<html lang='en'>
			<body>
				<Sidebar>
					<div className='px-4 pb-4 bg-bo-grey dark:bg-black dark:text-white'>
						<div className='h-max min-h-screen py-6'>{children}</div>
						<Footer />
					</div>
				</Sidebar>
			</body>
		</html>
	);
}
