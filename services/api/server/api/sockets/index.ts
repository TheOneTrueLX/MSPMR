import { Server } from 'socket.io'
import l from '../../common/logger';

import registerEchoHandler from './echo'

export default function initSocketHandlers(io: Server): void {
  io.on("connection", (socket) => {
    l.info('Socket connection established with client');
    registerEchoHandler(io, socket);
  })
};