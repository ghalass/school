// api/siteApi.js
import { API_PATHS } from '../utils/apiPaths';
import { apiRequest } from '../utils/apiRequest';

export const fetchUsers = async (token) => {
    return await apiRequest(API_PATHS.AUTH.GET_ALL_USERS, "GET", null, token);
};

export const createUser = async (data) => {
    return await apiRequest(API_PATHS.AUTH.REGISTER, "POST", data?.user, data?.token);
};

export const updateUser = async (data) => {
    return await apiRequest(API_PATHS.AUTH.UPDATE_USER, "PATCH", data?.user, data?.token);
};

export const deleteUser = async (data) => {
    return await apiRequest(API_PATHS.AUTH.DELETE_USER(data?.user?.id), "DELETE", null, data?.token);
};

export const loginUser = async (data) => {
    return await apiRequest(API_PATHS.AUTH.LOGIN, "POST", data, null);
};
