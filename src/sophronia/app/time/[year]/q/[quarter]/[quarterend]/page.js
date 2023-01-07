export default function Page({ params }) {
	return (
		<div>
			Holding Page for {params.year} / {params.quarter} - {params.quarterend}
		</div>
	);
}
