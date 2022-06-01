import { io } from 'socket.io-client'

const defaultSIOClientOptions = {
    withCredentials: true,
}

export const useSocketIO = (options = null) => {
    const socket = io('https://localhost:5000', options || defaultSIOClientOptions)
    return {
        socket,
    }
}