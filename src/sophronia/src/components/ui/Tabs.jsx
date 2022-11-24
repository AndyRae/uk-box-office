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

export const Tabs = ({ children }) => {
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
