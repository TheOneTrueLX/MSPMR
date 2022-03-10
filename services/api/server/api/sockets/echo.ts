import { Server, Socket } from 'socket.io'

export default function registerEchoHandler(io: Server, socket: Socket): void {
    
    socket.on("echo:send", (payload: any): void => {
        socket.emit("echo:receive", payload);
    });
}