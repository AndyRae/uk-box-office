export const Pagination = ({ pages, setPageIndex, pageIndex }) => {
	return (
		<nav aria-label='Pagination'>
			<ul className='inline-flex -space-x-px py-5'>
				{pageIndex > 1 && (
					<li>
						<button
							onClick={() => setPageIndex(pageIndex - 1)}
							className='py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
						>
							Previous
						</button>
					</li>
				)}
				{pages.map((page, index) => {
					const isActive = pageIndex === page;
					return (
						<li key={index}>
							<button
								onClick={() => setPageIndex(page)}
								className={`py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
									isActive ? 'bg-gray-200 dark:bg-blue-900' : ''
								}`}
							>
								{page}
							</button>
						</li>
					);
				})}
				{pageIndex < pages.length && (
					<li>
						<button
							onClick={() => setPageIndex(pageIndex + 1)}
							className='py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
						>
							Next
						</button>
					</li>
				)}
			</ul>
		</nav>
	);
};
