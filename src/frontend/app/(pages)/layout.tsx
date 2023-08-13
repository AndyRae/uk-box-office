import { Breadcrumbs } from '@/components/ui/breadcrumbs';

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
