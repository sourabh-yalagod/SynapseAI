import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASEURL }),
  tagTypes: ["documents", "subscription", "chats"],
  endpoints: (build) => ({
    //   ----------------------------------------------
    //                  Document API calls
    //   ----------------------------------------------
    getDocuments: build.query({
      query: () => ({
        url: `/api/document`,
      }),
      providesTags: ["documents"],
    }),
    deleteDocument: build.mutation({
      query: (docId) => ({
        url: `/api/document/${docId}`,
        method: "DELETE",
        params: { documentId: docId },
      }),
      invalidatesTags: ["documents"],
    }),
    getDocument: build.query({
      query: (documentId) => ({
        url: `/api/document/${documentId}`,
        params: { documentId },
      }),
    }),
    uploadFile: build.mutation({
      query: (formData) => ({
        url: "/api/upload",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
    //   ----------------------------------------------
    //                  Chats API calls
    //   ----------------------------------------------
    newChat: build.mutation({
      query: (payload) => ({
        url: `/api/chats/${payload?.documentId}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["chats"],
    }),
    getChats: build.query({
      query: (userId) => ({
        url: `/api/chats/${userId}`,
        params: { id: userId },
      }),
      providesTags: ["chats"],
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
  useGetDocumentQuery,
  // chats
  useGetChatsQuery,
  useNewChatMutation,
  // subscription
  useGetSubscriptionQuery,
  useNewSubscriptionMutation,
  useUploadFileMutation,
} = api;
