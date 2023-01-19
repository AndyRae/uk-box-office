import DefaultTags from '../DefaultTags';

export default async function Head() {
	return (
		<>
			<title>Forecast | Box Office Data</title>
			<DefaultTags />
			<meta
				name='description'
				content='UK Box Office forecast of the next 12 months of UK cinema box office revenue.'
			/>
			<meta
				property='og:description'
				content='UK Box Office forecast of the next 12 months of UK cinema box office revenue.'
			/>
			<meta
				name='twitter:description'
				content='UK Box Office forecast of the next 12 months of UK cinema box office revenue.'
			/>
		</>
	);
}
