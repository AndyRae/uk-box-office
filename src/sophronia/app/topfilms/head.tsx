import DefaultTags from '../DefaultTags';

export default async function Head() {
	return (
		<>
			<title>All Time Top Films | Box Office Data</title>
			<DefaultTags />
			<DefaultTags />
			<meta
				name='description'
				content='Top 50 films of all time at the UK box office. Including dashboards, statistics, reports, and analysis.'
			/>
			<meta
				property='og:description'
				content='Top 50 films of all time at the UK box office. Including dashboards, statistics, reports, and analysis.'
			/>
			<meta
				name='twitter:description'
				content='Top 50 films of all time at the UK box office. Including dashboards, statistics, reports, and analysis.'
			/>
		</>
	);
}
