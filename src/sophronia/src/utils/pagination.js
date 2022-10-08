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
	let l = Array.from([startPage, endPage]);
	return pageNumbers;
};
