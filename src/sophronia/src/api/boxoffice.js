import { useBackendApi } from "./ApiFetcher";
import useSWR from "swr";

export const fetchKeys = {
  boxoffice: (start_date, end_date, start, limit) => `boxoffice/all?start_date=${start_date}&end_date=${end_date}&=${start}&limit=${limit}`,
};

/**
 * Get a single boxoffice.
 */
export const useBoxOffice = (start_date, end_date, start, limit) => {
  const apiFetcher = useBackendApi();
  return useSWR(fetchKeys.boxoffice(start_date, end_date, start, limit), apiFetcher, {
    suspense: true,
  });
};
