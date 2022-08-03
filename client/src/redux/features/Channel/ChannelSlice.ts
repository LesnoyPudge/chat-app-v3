import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChannel } from '@backendTypes';
import { ChannelApi } from './ChannelApi';
import { RootState } from '@redux/store';
import { log } from '@utils';
import { socketEvents } from '@socket';



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
            socketEvents.channel.subscribe(payload);
        },
        unsubscribeFromChannel(state, { payload }: PayloadAction<string>) {
            channelAdapter.removeOne(state, payload);
            socketEvents.channel.unsubscribe(payload);  
        },
    },
    extraReducers(builder) {
        builder.addMatcher(
            ChannelApi.endpoints.createChannel.matchFulfilled,
            (state, { payload }) => {
                addChannel(payload);
            },
        );
        builder.addMatcher(
            ChannelApi.endpoints.deleteChannel.matchFulfilled,
            (state, { payload }) => {
                removeChannel(payload.id);
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