'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuContent,
	NavigationMenuTrigger,
	NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { buttonVariants } from '@/components/ui/button';

const listItemStyle =
	'block items-center justify-center border-gray-400 border-b py-2 px-2 w-auto text-sm font-medium bg-gradient-to-br from-transparent to-transparent hover:from-bo-primary hover:to-cyan-500';

export function BreadcrumbsTime() {
	const params = useParams();
	const year = parseInt(params.year as string);
	const month = params.month ? parseInt(params.month as string) : undefined;
	const quarter = params.quarter
		? parseInt(params.quarter as string)
		: undefined;

	return (
		<div className='flex items-center content-center gap-x-2 my-5 py-3.5 lg:py-3'>
			<div className='flex justify-start gap-x-1 text-sm font-medium'>
				<Link className={buttonVariants({ variant: 'link' })} href={'/'}>
					Dashboard
				</Link>
				<Link className={buttonVariants({ variant: 'link' })} href={'/time'}>
					Time
				</Link>
				{params.year && (
					<>
						<BreadcrumbsYears year={year} />

						<BreadcrumbsQuarters year={year} month={month} quarter={quarter} />

						<BreadcrumbsMonths year={year} month={month} />
					</>
				)}
			</div>
		</div>
	);
}

export function BreadcrumbsYears({ year }: { year: number }) {
	// List of the years +/- 5
	const currentYear = new Date().getFullYear();
	const maxYear = Math.min(year + 5, currentYear);
	const limit = Math.max(year - 5, 1980);
	const years = Array.from(
		Array(maxYear - limit + 1).keys(),
		(_, i) => maxYear - i
	);

	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>{year}</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className='md:w-[60px] lg:w-[80px]'>
							{years.map((y) => {
								return (
									<li className={listItemStyle} key={y}>
										<NavigationMenuLink key={y}>
											<Link href={`/time/${y}`}>{y}</Link>
										</NavigationMenuLink>
									</li>
								);
							})}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

export function BreadcrumbsQuarters({
	year,
	month = 1,
	quarter,
}: {
	year: number;
	month?: number;
	quarter?: number;
}) {
	// get the quarter
	const qt = quarter ? quarter : Math.floor((month! - 1) / 3 + 1);

	const quarters = [1, 2, 3, 4];

	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Q{qt}</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className='w-[40px]'>
							{quarters.map((q) => {
								return (
									<li className={listItemStyle} key={q}>
										<NavigationMenuLink key={q}>
											<Link href={`/time/${year}/q/${q}`}>Q{q}</Link>
										</NavigationMenuLink>
									</li>
								);
							})}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

export function BreadcrumbsMonths({
	year,
	month = 1,
}: {
	year: number;
	month?: number;
}) {
	type MonthsType = {
		[key: number]: string;
	};

	const months: MonthsType = {
		1: 'January',
		2: 'February',
		3: 'March',
		4: 'April',
		5: 'May',
		6: 'June',
		7: 'July',
		8: 'August',
		9: 'September',
		10: 'October',
		11: 'November',
		12: 'December',
	};

	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>{months[month]}</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul>
							{Object.keys(months).map((m) => {
								return (
									<li className={listItemStyle} key={m}>
										<NavigationMenuLink>
											<Link key={m} href={`/time/${year}/m/${m}`}>
												{months[parseInt(m)]}
											</Link>
										</NavigationMenuLink>
									</li>
								);
							})}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
