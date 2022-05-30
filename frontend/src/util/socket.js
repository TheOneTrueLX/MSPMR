import { io } from 'socket.io-client'

const SIOClientOptions = {
    withCredentials: true,
}

export const useSocketIO = () => {
    const socket = io('https://localhost:5000', SIOClientOptions)
    return {
        socket,
    }
}