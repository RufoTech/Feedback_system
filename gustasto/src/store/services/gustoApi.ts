import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface RestaurantInfo {
  id: string;
  name: string;
  logo: string;
  address: string;
}

export interface TableResponse {
  id: string;
  tableNumber: string;
  qrCodeUrl: string;
  restaurant: RestaurantInfo;
}

export const gustoApi = createApi({
  reducerPath: 'gustoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  endpoints: (builder) => ({
    getTable: builder.query<TableResponse, string>({
      query: (tableId) => `tables/${tableId}`,
    }),
    getRestaurant: builder.query<RestaurantInfo, string>({
      query: (restaurantId) => `restaurants/${restaurantId}`,
    }),
    submitRequest: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: 'requests',
        method: 'POST',
        body: formData,
        // Qeyd: body FormData olduqda fetchBaseQuery avtomatik olaraq boundary olan
        // multipart/form-data header-ini özü təyin edir, ona görə Content-Type yazmırıq.
      }),
    }),
  }),
});

export const { useGetTableQuery, useGetRestaurantQuery, useSubmitRequestMutation } = gustoApi;
