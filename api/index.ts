// import { newsService } from '../realm/services';

import client from "./client";

const api = {
  MPIN: {
    sendOtp: ({ data }: { data: { email: string } }) =>
      client({
        method: "post",
        url: "/user/send-otp",
        data,
      }),

    validateOtp: ({ data }: { data: { email: string; otp: string } }) =>
      client({
        method: "post",
        url: "/user/validate-otp",
        data,
      }),

    setNewMpin: ({ data }: { data: { email: string; newMpin: string } }) =>
      client({
        method: "post",
        url: "/user/set-new-mpin",
        data,
      }),
  },

  MEDIA: {
    getMedia: ({
      data,
    }: {
      data: { email: string; fileType: "image" | "video" };
    }) =>
      client({
        method: "post",
        url: "/get-media",
        data,
      }),
  },

  AI: {
    getAiResponse: ({ data }: { data: { prompt: string } }) =>
      client({
        method: "post",
        url: "/ai/gemini",
        data,
      }),
  },
};

export default api;

// Export individual functions for easier use
export const sendOtp = (data: { email: string }) => api.MPIN.sendOtp({ data });

export const validateOtp = (data: { email: string; otp: string }) =>
  api.MPIN.validateOtp({ data });

export const setNewMpin = (data: { email: string; newMpin: string }) =>
  api.MPIN.setNewMpin({ data });

export const getMedia = (data: {
  email: string;
  fileType: "image" | "video";
}) => api.MEDIA.getMedia({ data });
