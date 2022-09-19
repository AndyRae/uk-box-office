import { useBackendApi } from "./ApiFetcher";
import useSWR from "swr";

export const fetchKeys = {
  countryList: (pageIndex, limit) => `country/?start=${pageIndex}&limit=${limit}`,
  country: (slug) => `country/${slug}`,
};

/**
 * Get paginated list of countrys.
 */
export const useCountryList = (pageIndex=1, limit=10) => {
  const apiFetcher = useBackendApi();
  return useSWR(
    fetchKeys.countryList(pageIndex, limit),
    async (url) => {
      const data = await apiFetcher(url);
      return data;
    },
    { suspense: true }
  );
};

/**
 * Get a single country.
 */
export const useCountry = (id) => {
  const apiFetcher = useBackendApi();
  return useSWR(fetchKeys.country(id), apiFetcher, {
    suspense: true,
  });
};
