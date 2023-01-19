import DefaultTags from './DefaultTags';

export default function Head() {
	return (
		<>
			<DefaultTags />
			<title>Box Office Data</title>
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
