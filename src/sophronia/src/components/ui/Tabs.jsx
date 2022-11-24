import { useState, useRef, useEffect } from 'react';

export const Tabs = ({ tabs, children }) => {
	const [activeTab, setActiveTab] = useState(0);

	const handleTabClick = (e, index) => {
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
								onClick={(e) => handleTabClick(e, index)}
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
				{children.map((child, index) => {
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
				})}
			</div>
		</div>
	);
};

export const Tab = ({ children, id }) => {
	return (
		<div
			className='rounded-lg'
			id={id}
			role='tabpanel'
			aria-labelledby='dashboard-tab'
		>
			{children}
		</div>
	);
};

export const TabList = ({ children }) => {
	return (
		<div className='mb-2 border-b'>
			<ul
				className='flex flex-wrap -mb-px text-sm font-medium text-center'
				id='myTab'
				data-tabs-toggle='#myTabContent'
				role='tablist'
			>
				<li className='mr-2' role='presentation'>
					{children}
				</li>
			</ul>
		</div>
	);
};

export const TabTitle = ({ children, id, onClick, isActive }) => {
	return (
		<button
			className={`inline-block p-4 rounded-t-lg border-b-2 ${
				isActive
					? 'bg-gray-100 dark:bg-gray-900'
					: 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
			}`}
			id={id}
			onClick={onClick}
			data-tabs-target={`#${id}`}
			type='button'
			role='tab'
			aria-controls={id}
			aria-selected='false'
		>
			{children}
		</button>
	);
};

export const TabContent = ({ children, id }) => {
	return (
		<div
			className='py-1 rounded-lg'
			id={id}
			role='tabpanel'
			aria-labelledby={`${id}-tab`}
		>
			{children}
		</div>
	);
};
