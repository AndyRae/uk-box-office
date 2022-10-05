export const Tab = ({ children, id }) => {
	return (
		<div
			className='p-4 bg-gray-50 rounded-lg dark:bg-gray-800'
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
		<div className='mb-4 border-b border-gray-200 dark:border-gray-700'>
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

export const TabTitle = ({ children, id, onClick }) => {
	return (
		<button
			className='inline-block p-4 rounded-t-lg border-b-2'
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
			className='p-4 bg-gray-50 rounded-lg dark:bg-gray-800'
			id={id}
			role='tabpanel'
			aria-labelledby={`${id}-tab`}
		>
			{children}
		</div>
	);
};
