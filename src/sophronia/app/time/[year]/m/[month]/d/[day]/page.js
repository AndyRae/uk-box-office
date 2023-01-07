export default function Page({ params }) {
	return (
		<div>
			Holding Page for {params.year} / {params.month} / {params.day}
		</div>
	);
}
