import { Breadcrumbs } from '@/components/custom/breadcrumbs';

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
