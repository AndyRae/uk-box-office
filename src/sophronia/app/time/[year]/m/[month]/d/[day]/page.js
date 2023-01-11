import { TimePage } from '../../../../../time';

export default function Page({ params }) {
	return (
		<>
			<TimePage year={params.year} month={params.month} day={params.day} />
		</>
	);
}
