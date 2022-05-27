import { io } from 'socket.io-client'

export const useSocketIO = () => {
    const socket = io('https://localhost:5000')
    return {
        socket,
    }
}