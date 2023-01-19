import DefaultTags from '../DefaultTags';

export default async function Head() {
	return (
		<>
			<title>Forecast | Box Office Data</title>
			<DefaultTags />
			<meta
				name='description'
				content='UK Box Office gives detailed cinema box office revenue for the UK film industry. Including dashboards, statistics, reports, and analysis.'
			/>
			<meta
				property='og:description'
				content='UK Box Office provides detailed cinema box office revenue for the UK film industry. Including dashboards, statistics, reports, and analysis.'
			/>
			<meta
				name='twitter:description'
				content='UK Box Office provides detailed cinema box office revenue for the UK film industry. Including dashboards, statistics, reports, and analysis.'
			/>
		</>
	);
}
