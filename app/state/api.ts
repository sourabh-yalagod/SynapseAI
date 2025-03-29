import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASEURL }),
  tagTypes: ["documents", "subscription"],
  endpoints: (build) => ({
    //   ----------------------------------------------
    //                  Document API calls
    //   ----------------------------------------------
    getDocuments: build.query({
      query: (userId) => ({
        url: `/api/document`,
        // params: { userId },
      }),
      providesTags: ["documents"],
    }),
    deleteDocument: build.mutation({
      query: (docId) => ({
        url: `/api/document/${docId}`,
        method: "DELETE",
        params: { documentId: docId },
        providesTags: ["documents"],
      }),
    }),
    //   ----------------------------------------------
    //                  Chats API calls
    //   ----------------------------------------------
    newChat: build.mutation({
      query: (payload) => ({
        url: `/api/chats/${payload?.userId}`,
        method: "POST",
        body: payload,
      }),
    }),
    getChats: build.query({
      query: (userId) => ({ url: `/api/chats/${userId}`, params: { userId } }),
    }),
    //   ----------------------------------------------
    //                  Subscription API calls
    //   ----------------------------------------------

    newSubscription: build.mutation({
      query: (payload) => ({
        url: `/api/subscription/${payload.userId}`,
        params: { id: payload.userId },
        body: payload,
        method: "POST",
        providesTags: ["subscription"],
      }),
    }),
    getSubscription: build.query({
      query: (userId) => ({
        url: `/api/subscription/${userId}`,
        params: { id: userId },
      }),
    }),
  }),
});

export const {
  // documents
  useGetDocumentsQuery,
  useDeleteDocumentMutation,
  // chats
  useGetChatsQuery,
  useNewChatMutation,
  // subscription
  useGetSubscriptionQuery,
  useNewSubscriptionMutation,
} = api;
