export const paginate = (count, pageIndex, pageLimit) => {
  const pages = Math.ceil(count / pageLimit);
  const pageNumbers = [];

  let startPage = pageIndex - 2;
  let endPage = pageIndex + 3;

  if (startPage <= 0) {
    startPage = 1;
    endPage = 10;
  }
  if (endPage > pages) {
    endPage = pages;
    startPage = pages - 10;
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  return(pageNumbers);
}
