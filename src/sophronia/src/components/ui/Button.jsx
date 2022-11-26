export const Button = ({ children, onClick, isActive, ...props }) => {
	return (
		<button
			onClick={onClick}
			className=' max-w-fit relative inline-flex items-center justify-center p-0.5 mr-2 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800'
			{...props}
		>
			<span
				className={`relative px-5 py-1.5 transition-all inline-flex items-center ease-in duration-75  rounded-md group-hover:bg-opacity-0 ${
					isActive ? 'bg-opacity-0' : 'bg-white dark:bg-gray-900'
				}`}
			>
				{children}
			</span>
		</button>
	);
};
