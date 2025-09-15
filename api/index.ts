// import { newsService } from '../realm/services';

import client from "./client";



const api = {

    MPIN: {
        sendOtp: ({ data }: { data: { email: string } }) =>
            client({
                method: 'post',
                url: '/user/send-otp',
                data,
            }),

        validateOtp: ({ data }: { data: { email: string; otp: string } }) =>
            client({
                method: 'post',
                url: '/user/validate-otp',
                data,
            }),

        setNewMpin: ({ data }: { data: { email: string; newMpin: string } }) =>
            client({
                method: 'post',
                url: '/user/set-new-mpin',
                data,
            }),
    },

   

  
  



    //   NEWS: {
    //     getNews: (forceRefresh = false) =>
    //       manageGenericReponse({
    //         method: 'get',
    //         endpoint: '/news',
    //         realmService: newsService,
    //         forceRefresh,
    //         dataKey: 'data',
    //         mapToApi: item => ({
    //           name: item?.name,
    //           description: item?.description,
    //           createdAt: item?.createdAt,
    //         }),
    //       }),

    //     addNews: (values: { name: string; description: string }) =>
    //       manageGenericReponse({
    //         method: 'post',
    //         endpoint: '/news',
    //         realmService: newsService,
    //         values,
    //         mapToApi: item => ({
    //           name: item?.name,
    //           description: item?.description,
    //           createdAt: item?.createdAt,
    //         }),
    //       }),

    //     deleteNews: (id: string) =>
    //       manageGenericReponse({
    //         method: 'delete',
    //         endpoint: '/news',
    //         realmService: newsService,
    //         id,
    //       }),

    //     editNews: (values: { id: string; name: string; description: string }) =>
    //       manageGenericReponse({
    //         method: 'put',
    //         endpoint: '/news',
    //         realmService: newsService,
    //         values,
    //         mapToApi: item => ({
    //           name: item?.name,
    //           description: item?.description,
    //           createdAt: item?.createdAt,
    //         }),
    //       }),
    //   },
};

export default api;

// Export individual functions for easier use
export const sendOtp = (data: { email: string }) => 
  api.MPIN.sendOtp({ data });

export const validateOtp = (data: { email: string; otp: string }) => 
  api.MPIN.validateOtp({ data });

export const setNewMpin = (data: { email: string; newMpin: string }) => 
  api.MPIN.setNewMpin({ data });
