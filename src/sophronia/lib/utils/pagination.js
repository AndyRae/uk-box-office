/**
 * Paginate items
 * @param {number} count - Total number of items
 * @param {number} pageIndex - Page number to start from.
 * @param {number} pageLimit - Number of items per page.
 * @returns an array of page numbers.
 * @example
 * const pageNumbers = paginate(100, 1, 10);
 * // pageNumbers = [1, 2, 3, 4, 5]
 */
export const paginate = (count, pageIndex, pageLimit) => {
	if (count < pageLimit) {
		return [1];
	}
	const maxPages = Math.ceil(count / pageLimit);
	const pageNumbers = [];

	let startPage = pageIndex - 2;
	let endPage = pageIndex + 3;

	if (startPage <= 1) {
		startPage = 1;
		endPage = 5;
	}

	if (endPage > maxPages) {
		endPage = maxPages;
	}
	for (let i = startPage; i <= endPage; i++) {
		pageNumbers.push(i);
	}
	return pageNumbers;
};
