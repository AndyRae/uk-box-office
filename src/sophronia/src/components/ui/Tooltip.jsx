export const Tooltip = ({ children, text, ...props }) => {
	return (
		<div className='group' {...props}>
			<span className='tooltip-text text-sm font-medium shadow-md bg-slate-50 dark:bg-slate-900 dark:text-white p-1 -mt-12 -mr-10 rounded-lg hidden group-hover:block absolute text-center py-2 px-4 z-50'>
				{text}
			</span>
			{children}
		</div>
	);
};
