import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPrivateChannel } from '@backendTypes';
import { PrivateChannelApi } from './PrivateChannelApi';
import { RootState } from '@redux/store';
import { log, socket } from '@utils';



const privateChannelAdapter = createEntityAdapter<IPrivateChannel>();

const initialState = privateChannelAdapter.getInitialState();

export const PrivateChannelSlice = createSlice({
    name: 'privateChannel',
    initialState,           
    reducers: {
        addPrivateChannel(state, { payload }: PayloadAction<IPrivateChannel>) {
            privateChannelAdapter.upsertOne(state, payload);
        },
        removePrivateChannel(state, { payload }: PayloadAction<string>) {
            privateChannelAdapter.removeOne(state, payload);
        },
        subscribeOnPrivateChannel(state, { payload }: PayloadAction<string>) {
            socket.events.privateChannel.subscribe(payload);
        },
        unsubscribeFromPrivateChannel(state, { payload }: PayloadAction<string>) {
            privateChannelAdapter.removeOne(state, payload);
            socket.events.privateChannel.unsubscribe(payload);  
        },
    },
    extraReducers(builder) {
        builder.addMatcher(
            PrivateChannelApi.endpoints.createPrivateChannel.matchFulfilled,
            (state, { payload }) => {
                PrivateChannelSlice.reducer(state, addPrivateChannel(payload));
            },
        );
        builder.addMatcher(
            PrivateChannelApi.endpoints.leavePrivateChannel.matchFulfilled,
            (state, { payload }) => {
                PrivateChannelSlice.reducer(state, removePrivateChannel(payload.id));
            },
        );
    },
});

export const {
    addPrivateChannel,
    removePrivateChannel,
    subscribeOnPrivateChannel,
    unsubscribeFromPrivateChannel,

} = PrivateChannelSlice.actions;

export const {
    selectById: selectPrivateChannelById,
    selectIds: selectPrivateChannelsIds,
    selectEntities: selectPrivateChannelsEntities,
    selectAll: selectAllPrivateChannels,
    selectTotal: selectTotalPrivateChannels,
} = privateChannelAdapter.getSelectors((state: RootState) => state.privateChannel);