'use client'
import { endpoints } from "@/config";
import { baseApi } from "../base";

export const demoApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getQuestions: build.query<any, {amount:number}>({
            query: (params) => ({
                url: endpoints.demoEndpoints.GET_AMOUNT_OF_QUESTION,
                params: params,
                flashError: true,
                method: 'GET',
            }) ,
            extraOptions: {skipAuth: true}
        }),

        //todo mutation instead of query for some solution using endpoint with method POST PATCH, DELETE etc. 
        //todo more info https://redux-toolkit.js.org/rtk-query/usage/mutations
    }), 
})

export const {
    useGetQuestionsQuery
} = demoApi;