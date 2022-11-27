export const Pagination = ({ pages, setPageIndex, pageIndex }) => {
	return (
		<nav aria-label='Pagination'>
			<ul className='inline-flex -space-x-px py-5'>
				{pageIndex > 1 && (
					<li>
						<button
							onClick={() => setPageIndex(pageIndex - 1)}
							className='py-2 px-3 ml-0 leading-tight rounded-l-lg border border-gray-300 hover:bg-bo-primary hover:text-white dark:border-gray-700 transition-all duration-300'
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
								className={`py-2 px-3 leading-tight border border-gray-300 hover:bg-bo-primary hover:text-white dark:border-gray-700 transition-all duration-300 ${
									isActive ? 'bg-bo-primary text-white' : ''
								}`}
							>
								{page}
							</button>
						</li>
					);
				})}
				{pageIndex < pages[pages.length - 1] && (
					<li>
						<button
							onClick={() => setPageIndex(pageIndex + 1)}
							className='py-2 px-3 leading-tight rounded-r-lg border border-gray-300 hover:bg-bo-primary hover:text-white dark:border-gray-700 transition-all duration-300'
						>
							Next
						</button>
					</li>
				)}
			</ul>
		</nav>
	);
};
