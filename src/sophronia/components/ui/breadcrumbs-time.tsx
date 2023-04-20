'use client';

import React from 'react';
import Link from 'next/link';
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuContent,
	NavigationMenuTrigger,
	NavigationMenuLink,
	NavigationMenuViewport,
} from './navigation-menu';

const listItemStyle =
	'block items-center justify-center border-gray-400 border-b py-2 px-2 w-auto text-sm font-medium bg-gradient-to-br from-transparent to-transparent hover:from-bo-primary hover:to-cyan-500';

export function BreadcrumbsTime({
	year = 2022,
	month = 1,
	quarter,
}: {
	year?: number;
	month?: number;
	quarter?: number;
}) {
	return (
		<div className='flex items-center gap-x-2 my-5 py-3.5 lg:py-3'>
			<div className='flex justify-start gap-x-1 text-sm font-medium'>
				<Link
					href={'/'}
					className='animate-[highlight_1s_ease-in-out_1] capitalize py-0.5  text-gray-500 dark:text-gray-500'
				>
					Dashboard
				</Link>
				<span className='text-gray-600 px-1.5'>/</span>
				<Link
					href={'/time'}
					className='animate-[highlight_1s_ease-in-out_1] capitalize py-0.5  text-gray-500 dark:text-gray-500'
				>
					Time
				</Link>
				<span className='text-gray-600 px-1.5'>/</span>
				<BreadcrumbsYears year={year} />
				<span className='text-gray-600 px-1.5'>/</span>
				<BreadcrumbsQuarters year={year} month={month} quarter={quarter} />
				<span className='text-gray-600 px-1.5'>/</span>
				<BreadcrumbsMonths year={year} month={month} />
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
									<li className={listItemStyle}>
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
	month,
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
									<li className={listItemStyle}>
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
									<li className={listItemStyle}>
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
