'use client';

import {
	JSXElementConstructor,
	Key,
	MouseEvent,
	ReactElement,
	ReactFragment,
	ReactPortal,
	SetStateAction,
	useState,
} from 'react';

/**
 * @file Tabs.jsx
 * @description Tabs component to display content in tabs.
 * @param {array} tabs - The array of tab names
 * @param {array} children - The array of tab content
 * @returns {JSX.Element}
 * @example
 * <Tabs tabs={[{ title: 'Tab 1' }, { title: 'Tab 2' }]}>
 * 	<div>Tab 1 content</div>
 * 	<div>Tab 2 content</div>
 * </Tabs>
 */
export const Tabs = ({
	tabs,
	children,
}: {
	tabs: [any];
	children: any;
}): JSX.Element => {
	const [activeTab, setActiveTab] = useState(0);

	const handleTabClick = (
		_e: MouseEvent<HTMLButtonElement>,
		index: SetStateAction<number>
	) => {
		setActiveTab(index);
	};

	return (
		<div className='tabs'>
			<ul
				className='border-b flex flex-wrap -mb-px text-sm font-medium text-center'
				role='tablist'
				aria-label='Tabs'
			>
				{tabs.map((child, index) => {
					return (
						<li key={index} className='tabs__item' role='presentation'>
							<button
								className={`inline-block p-4 rounded-t-lg border-b-2 ${
									activeTab === index
										? 'bg-gray-100 dark:bg-gray-900'
										: 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
								}`}
								role='tab'
								aria-selected={activeTab === index ? 'true' : 'false'}
								aria-controls={`panel-${index}`}
								id={`tab-${index}`}
								data-tab={index}
								onClick={(e): void => handleTabClick(e, index)}
							>
								{child.title}
							</button>
						</li>
					);
				})}
			</ul>
			<div
				className='my-8 rounded-lg'
				role='tabpanel'
				aria-labelledby={`tab-${activeTab}`}
			>
				{children.map(
					(
						child:
							| string
							| number
							| boolean
							| ReactElement<any, string | JSXElementConstructor<any>>
							| ReactFragment
							| ReactPortal,
						index: Key
					) => {
						return (
							<div
								key={index}
								className='rounded-lg'
								role='presentation'
								data-tab={index}
								hidden={activeTab !== index}
							>
								{child}
							</div>
						);
					}
				)}
			</div>
		</div>
	);
};
