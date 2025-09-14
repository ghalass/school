// hooks/useUsers.js
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, createUser, updateUser, deleteUser, loginUser, } from '../api/userApi';
import { useAuthContext } from './useAuthContext';

export function createUserQuery() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createUser(data),
        onSuccess: (user) => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["usersList"] });
        }
    })
}

export function loginQuery() {
    const { dispatch } = useAuthContext();
    return useMutation({
        mutationFn: loginUser,
        onSuccess: (user) => {
            // SAVE THE USER TO LOCALSTORAGE
            localStorage.setItem('user', JSON.stringify(user));
            // UPDATE CONTEXT USER STATE AFTER LOGIN 
            dispatch({ type: "LOGIN", payload: user });
        }
    })
}

export function deleteUserQuery() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => deleteUser(data),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["usersList"] });
        },
    })
}

export function fecthUsersQuery(token) {
    return queryOptions({
        queryKey: ["usersList"],
        queryFn: () => fetchUsers(token),
    })
}

export function updateUserQuery() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => updateUser(data),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["usersList"] });
        },
    })
}
