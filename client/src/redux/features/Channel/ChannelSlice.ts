import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChannel } from '@backendTypes';
import { ChannelApi } from './ChannelApi';
import { RootState } from '@redux/store';
import { log, socket } from '@utils';



const channelAdapter = createEntityAdapter<IChannel>();

const initialState = channelAdapter.getInitialState();

export const ChannelSlice = createSlice({
    name: 'channel',
    initialState,           
    reducers: {
        addChannel(state, { payload }: PayloadAction<IChannel>) {
            channelAdapter.upsertOne(state, payload);
        },
        removeChannel(state, { payload }: PayloadAction<string>) {
            channelAdapter.removeOne(state, payload);
        },
        subscribeOnChannel(state, { payload }: PayloadAction<string>) {
            socket.events.channel.subscribe(payload);
        },
        unsubscribeFromChannel(state, { payload }: PayloadAction<string>) {
            channelAdapter.removeOne(state, payload);
            socket.events.channel.unsubscribe(payload);  
        },
    },
    extraReducers(builder) {
        builder.addMatcher(
            ChannelApi.endpoints.createChannel.matchFulfilled,
            (state, { payload }) => {
                ChannelSlice.reducer(state, addChannel(payload));
            },
        );
        builder.addMatcher(
            ChannelApi.endpoints.deleteChannel.matchFulfilled,
            (state, { payload }) => {
                ChannelSlice.reducer(state, removeChannel(payload.id));
            },
        );
    },
});

export const {
    addChannel,
    removeChannel,
    subscribeOnChannel,
    unsubscribeFromChannel,

} = ChannelSlice.actions;

export const {
    selectById: selectChannelById,
    selectIds: selectChannelsIds,
    selectEntities: selectChannelsEntities,
    selectAll: selectAllChannels,
    selectTotal: selectTotalChannels,
} = channelAdapter.getSelectors((state: RootState) => state.channel);