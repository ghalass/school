// utilis/apiPaths.js
export const API_PATHS = {
    AUTH: {
        LOGIN: "/user/login",
        LOGOUT: "/user/logout",
        REGISTER: "/user/signup",
        CHECK_TOKEN: "/user/checktoken",
        UPDATE_USER: "/user/updateUser",
        DELETE_USER: (id) => `/user/${id}`,
        GET_USER_INFO: "/user/getUserInfo",
        GET_ALL_USERS: "/user/users",

    },
};