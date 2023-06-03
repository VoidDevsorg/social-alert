/// <reference types="node" />
import { EventEmitter } from 'node:events';
import { Client } from './types';
export declare class Twitch extends EventEmitter {
    liveChannels: Set<string>;
    channels: Set<string>;
    private client;
    constructor({ channels, liveChannels, interval, client }: {
        channels: string[];
        liveChannels: string[];
        interval: number;
        client: Client;
    });
    addChannel(channel: string): void;
    removeChannel(channel: string): void;
    getChannels(): Set<string>;
    getLiveChannels(): Set<string>;
    private _newStream;
    private _streamEnded;
    private _checkForNewStreams;
    getToken(): Promise<any>;
}
