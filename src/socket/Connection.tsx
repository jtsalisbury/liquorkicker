import { PouringStatus } from "../models/PouringStatus";
import { io, Socket } from 'socket.io-client';
import { EVENTS } from "../constants/constants";

export class Connection {
    private socket: Socket;
    private setStatus;

    constructor(setStatus: any) {
        this.setStatus = setStatus;
        
        console.log("Attempting new socket connection")

        this.socket = io('http://localhost:8080', {
            transports: ['websocket', 'polling', 'flashsocket']
        });

        console.log('connected to server');

        this.socket.on('connection', () => console.log('connected'));
        this.socket.on(EVENTS.POUR_IN_PROGRESS, (status) => {
            this.handlePourStatus(status)
        });
        this.socket.on(EVENTS.POUR_FINISHED, (status) => {
            this.handlePourFinished(status)
        });

        this.socket.on('disconnect', () => this.disconnect());
        this.socket.on('connect_error', (err: any) => {
            console.log('Failed to connect: ', err);
        });

        this.socket.emit(EVENTS.REQUEST_POUR, JSON.stringify({ drink_id: 0 }))
    }

    handlePourStatus(status: string) {
        this.setStatus(JSON.parse(status));
    }

    handlePourFinished(stuff: any) {
        this.setStatus(null);
    }

    disconnect() {
        console.log('Disconnected from socket');
    }
}