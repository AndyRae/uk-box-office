import Script from 'next/script';

/**
 * Very simple JSON-LD component for structured data.
 * @returns JSON-LD structured data for the current page
 */
export const StructuredSiteData = () => {
	const data = {
		'@context': 'http://schema.org',
		'@type': 'WebSite',
		url: 'https://www.boxofficedata.co.uk',
		name: 'UK Box Office Data',
		description:
			'UK Box Office provides detailed cinema box office revenue for the UK film industry.',
		potentialAction: {
			'@type': 'SearchAction',
			target: 'https://boxofficedata.co.uk/search?q={search_term_string}',
			'query-input': 'required name=search_term_string',
		},
		'@graph': [
			{
				'@type': 'Organization',
				url: 'https://boxofficedata.co.uk',
				logo: {
					'@type': 'ImageObject',
					url: 'https://boxofficedata.co.uk/static/icons/icon-hires.png',
				},
			},
		],
	};
	return <Script type='application/ld+json'>{JSON.stringify(data)}</Script>;
};

/**
 * JSON-LD structured data for data pages.
 * It's annoying to combine this data type with the above component, so slight duplication.
 * @param {title} title of the page
 * @param {endpoint} url of the pgae
 * @param {time} time period of the page
 * @returns JSON-LD structured data for the current page.
 * TODO: Fix this in NextJS
 */
export const StructuredTimeData = ({ title, endpoint, time }) => {
	const data = {
		'@context': 'http://schema.org',
		'@type': 'WebSite',
		url: 'https://www.boxofficedata.co.uk',
		name: 'UK Box Office Data',
		description:
			'UK Box Office provides detailed cinema box office revenue for the UK film industry.',
		potentialAction: {
			'@type': 'SearchAction',
			target: 'https://boxofficedata.co.uk/search?q={search_term_string}',
			'query-input': 'required name=search_term_string',
		},
		'@graph': [
			{
				'@type': 'Organization',
				url: 'https://boxofficedata.co.uk',
				logo: {
					'@type': 'ImageObject',
					url: 'https://boxofficedata.co.uk/static/icons/icon-hires.png',
				},
			},
		],
		'@context': 'https://schema.org/',
		'@type': 'Dataset',
		name: `${title} Box Office Data`,
		description: `UK Cinema Box Office revenue data for: ${title}.`,
		url: `https://boxofficedata.co.uk${endpoint}`,
		isBasedOn:
			'https://www.bfi.org.uk/industry-data-insights/weekend-box-office-figures',
		keywords: [`BOX OFFICE DATA > CINEMA > ${title}`],
		license: 'https://creativecommons.org/licenses/by-sa/4.0/',
		isAccessibleForFree: true,
		creator: {
			'@type': 'Organization',
			url: 'https://boxofficedata.co.uk',
			name: 'Box Office Data UK',
			contactPoint: {
				'@type': 'ContactPoint',
				contactType: 'customer service',
				email: 'hello@boxofficedata.co.uk',
			},
		},
		funder: {
			'@type': 'Organization',
			sameAs: 'https://ror.org/04qg9vz18',
			name: 'British Film Institute',
		},
		includedInDataCatalog: {
			'@type': 'DataCatalog',
			name: 'Box Office Data UK',
		},
		distribution: [
			{
				'@type': 'DataDownload',
				encodingFormat: 'CSV',
				contentUrl: `https://boxofficedata.co.uk${endpoint}`,
			},
		],
		temporalCoverage: `${time}`,
	};
	return <Script type='application/ld+json'> {JSON.stringify(data)} </Script>;
};
