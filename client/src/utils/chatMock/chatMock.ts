import { getRandomNumber } from '@utils';
import { loremIpsum } from 'lorem-ipsum';
import { EmojiCode, RTETypes } from '@components';
import { IMessage } from '@backendTypes';
import { Descendant } from 'slate';
import { SliceEntityState } from '@types';
import { chance } from '@lesnoypudge/utils';



type Message = IMessage & {
    reactions: {
        code: EmojiCode;
        users: string[];
    }[];
}
// type Message = SliceEntityState.Message

export class ChatMock {
    messages: Message[];
    timeline: number[];
    chunkSize: number;

    constructor(length: number, chunkSize: number) {
        this.chunkSize = chunkSize;
        this.timeline = this.generateTimestampsArray(length);
        this.messages = Array(length).fill(null).map((_, i) => this.createMessage(i, this.timeline[i]));
    }

    private generateEarlierTimestamp(timestamp: number): number {
        const maxTimestampMs = timestamp - 1000;
        const minTimestampMs = timestamp - (3 * 24 * 60 * 60 * 1000);
        const randomTimestampMs = Math.floor(Math.random() * (maxTimestampMs - minTimestampMs + 1)) + minTimestampMs;
      
        return randomTimestampMs;
    }

    private generateTimestampsArray(count: number): number[] {
        const timestamps: number[] = Array(count);
        let previousTimestampMs = Date.now();
      
        for (let i = 0; i < count; i++) {
            const timestampMs = i === 0 ? Date.now() : this.generateEarlierTimestamp(previousTimestampMs);
            timestamps[i] = timestampMs;
            previousTimestampMs = timestampMs;
        }
      
        return timestamps.reverse();
    }

    private createMessage(index: number, createdAt: number = Date.now()): Message {
        return {
            id: index.toString(),
            user: getRandomNumber(1, 2).toString(),
            chat: '1',
            content: JSON.stringify([{
                type: 'paragraph',
                children: [{
                    text: `${index} ${loremIpsum({ count: getRandomNumber(1, 3) })}`,
                }],
            }]),
            createdAt: this.timeline[index] ? this.timeline[index] : createdAt,
            updatedAt: Date.now(),
            isChanged: chance(1 / 5),
            isDeleted: false,
            attachments: [],
            reactions: [],
            respondOn: []
        };
    }

    getMessagesBeforeTimestamp = (timestamp: number, amount = this.chunkSize) => {
        return this.messages.filter((message) => message.createdAt < timestamp).slice(-(amount));
    };

    getMessagesAfterTimestamp = (timestamp: number, amount = this.chunkSize) => {
        return this.messages.filter(item => item.createdAt >= timestamp).slice(0, amount);
    };

    addNewMessage(): [index: number, message: Message] {
        this.timeline.push(Date.now());
        const prevLength = this.messages.length;
        const newMessage = this.createMessage(prevLength);
        this.messages.push(newMessage);

        return [prevLength, newMessage];
    }

    getLastMessagesChunk(amount = this.chunkSize) {
        return this.messages.slice(-(amount));
    }
}

export const createSingleMessage = (content: RTETypes.Nodes): Message => ({
    id: Math.random().toString(),
    chat: Math.random().toString(),
    content: JSON.stringify(content),
    user: Math.random().toString(),
    attachments: [],
    isChanged: false,
    isDeleted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reactions: [],
    respondOn: []
});