export function HeadTags() {
	return (
		<>
			<meta
				name='viewport'
				content='width=device-width, initial-scale=1, maximum-scale=1'
			/>
			<meta name='apple-mobile-web-app-capable' content='yes' />
			<meta name='mobile-web-app-capable' content='yes' />

			<link
				rel='apple-touch-icon'
				sizes='180x180'
				href='/icons/apple-touch-icon.png'
			/>
			<link
				rel='icon'
				type='image/png'
				sizes='32x32'
				href='/icons/favicon-32x32.png'
			/>
			<link
				rel='icon'
				type='image/png'
				sizes='16x16'
				href='/icons/favicon-16x16.png'
			/>

			<meta name='msapplication-TileColor' content='#2b5797' />

			<link rel='manifest' href='/manifest.json' />

			<meta property='og:title' content='UK Box Office Data' />
			<meta property='og:image' content='/icons/1.png' />

			<meta name='twitter:card' content='summary' />
			<meta name='twitter:creator' content='@AndyRae_' />
			<meta name='twitter:image' content='/icons/1.png' />

			{/* <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-H0HGC7K5TL"
      ></script>
      <script async>
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'G-H0HGC7K5TL');
      </script> */}
		</>
	);
}

/**
 * Default tags for all pages, including description, viewport, icons, etc.
 * @param description Optional description for the page (defaults to UK Box Office)
 * @returns Default tags for all pages
 */
export default function DefaultTags({
	description = 'UK Box Office gets the latest box office revenue and data for the UK film industry. Including dashboards, statistics, reports, and analysis.',
}) {
	return (
		<>
			<HeadTags />
			<meta name='description' content={description} />
			<meta property='og:description' content={description} />
			<meta name='twitter:description' content={description} />
		</>
	);
}
