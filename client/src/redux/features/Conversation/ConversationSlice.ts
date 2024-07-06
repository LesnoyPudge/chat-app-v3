import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@redux/store';
import { createCustomizedEntityAdapter } from '@redux/utils';






type ExternalState = {
    localConnection: RTCPeerConnection | null;
    localMediaStream: MediaStream | null;
    remoteMediaStreams: MediaStream[];
    stuns: string[] | null;
}

const externalState = {
    localConnection: null,
    localMediaStream: null,
    remoteMediaStreams: [],
    stuns: null,
}

type Conversation = {
    id: string;
    ownerType: 'room' | 'privateChat';
    ownerId: string;
    participants: string[],
}

const adapter = createCustomizedEntityAdapter<Conversation>();

const initialState = adapter.getInitialState();


// const getInitialState = (): ConversationState => {
//     return {
        
//     };
// };

export const ConversationSlice = createSlice({
    name: 'Conversation',
    initialState,
    reducers: {
        some: (state) => {
        },
    },
    extraReducers(builder) {},
});

