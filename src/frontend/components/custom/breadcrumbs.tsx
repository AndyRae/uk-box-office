'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Breadcrumbs() {
	const pathname = usePathname();

	function generateBreadcrumbs() {
		// Remove any query parameters, as those aren't included in breadcrumbs
		const asPathWithoutQuery = pathname.split('?')[0];

		// Break down the path between "/"s, removing empty entities
		// Ex:"/my/nested/path" --> ["my", "nested", "path"]
		const asPathNestedRoutes = asPathWithoutQuery
			.split('/')
			.filter((v) => v.length > 0);

		// Iterate over the list of nested route parts and build
		// a "crumb" object for each one.
		const crumblist = asPathNestedRoutes.map((subpath, idx) => {
			// We can get the partial nested route for the crumb
			// by joining together the path parts up to this point.
			const href = '/' + asPathNestedRoutes.slice(0, idx + 1).join('/');
			// The title will just be the route string for now
			const title = subpath;
			return { href, title };
		});

		// Add in a default "Home" crumb for the top-level
		return [{ href: '/', title: 'Dashboard' }, ...crumblist];
	}

	const breadcrumbs = generateBreadcrumbs();

	return (
		<div className='flex items-center gap-x-2 my-5 py-3.5 lg:py-3'>
			<div className='flex gap-x-1 text-sm font-medium'>
				{pathname ? (
					<>
						{breadcrumbs.map((segment, index) => {
							return (
								<React.Fragment key={segment.title}>
									{index > 0 && <span className='text-gray-600 px-1.5'>/</span>}
									<span>
										<Link
											key={segment.title}
											href={segment.href}
											className='animate-[highlight_1s_ease-in-out_1] capitalize py-0.5  text-gray-500 dark:text-gray-500'
										>
											{segment.title.replaceAll('-', ' ')}
										</Link>
									</span>
								</React.Fragment>
							);
						})}
					</>
				) : null}
			</div>
		</div>
	);
}
