import { TimePage } from '../time';

export default function Page({ params }) {
	return (
		<>
			<TimePage year={params.year} />
		</>
	);
}
