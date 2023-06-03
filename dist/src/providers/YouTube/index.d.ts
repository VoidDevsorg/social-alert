/// <reference types="node" />
import { EventEmitter } from 'node:events';
export declare class YouTube extends EventEmitter {
    postedVideos: Set<string>;
    channels: Set<string>;
    constructor({ channels, postedVideos, interval }: {
        channels: string[];
        postedVideos: string[];
        interval: number;
    });
    addChannel(channel: string): void;
    removeChannel(channel: string): void;
    getChannels(): Set<string>;
    getPostedVideos(): Set<string>;
    private _newVideo;
    private _checkForNewVideos;
}
