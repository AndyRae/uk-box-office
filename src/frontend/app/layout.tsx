// These styles apply to every route in the application
import 'styles/globals.css';
import { Sidebar } from '@/components/custom/sidebar';
import { Footer } from '@/components/custom/footer';
import { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/theme-provider';

const title = 'Box Office Data Dashboard';
const description =
	'UK Box Office gets the latest box office revenue and data for the UK film industry. Including dashboards, statistics, reports, and analysis.';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	return (
		<html lang='en' suppressHydrationWarning>
			<body>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
					<Sidebar>
						<div className='px-4 pb-4'>
							<div className='h-max min-h-screen py-6'>{children}</div>
							<Footer />
						</div>
					</Sidebar>
				</ThemeProvider>
			</body>
			<Analytics />
		</html>
	);
}

export const metadata: Metadata = {
	metadataBase: new URL('https://boxofficedata.co.uk'),
	title: title,
	description: description,
	openGraph: {
		title: title,
		description: description,
		url: 'https://boxofficedata.co.uk',
		siteName: title,
		locale: 'en-GB',
		type: 'website',
	},
	icons: {
		icon: '/icons/favicon.ico',
		apple: '/icons/apple-touch-icon.png',
	},
	themeColor: 'black',
	manifest: '/manifest.json',
	twitter: {
		card: 'summary',
		title: title,
		description: description,
		creator: '@AndyRae_',
	},
};
