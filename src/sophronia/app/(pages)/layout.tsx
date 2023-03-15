import { Breadcrumbs } from 'components/ui/Breadcrumbs';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Breadcrumbs />
			{children}
		</>
	);
}
