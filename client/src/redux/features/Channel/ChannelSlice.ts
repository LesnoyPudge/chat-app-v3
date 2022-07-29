import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChannel } from '@backendTypes';
import { RootState } from '@redux';
import ChannelApi from './ChannelApi';
import { socket } from '@socket';



const channelAdapter = createEntityAdapter<IChannel>();

const initialState = channelAdapter.getInitialState();

export const ChannelSlice = createSlice({
    name: 'channel',
    initialState,           
    reducers: {
        subcribeOnChannel(state, { payload }: PayloadAction<{userId: string, targetId: string}>) {
            socket.channel.subscribe(payload);
        },
        reciveChannelInfo(state, { payload }: PayloadAction<IChannel>) {
            channelAdapter.upsertOne(state, payload);
        },
        unsubscribeFromChannel(state, { payload }: PayloadAction<{targetId: string}>) {
            channelAdapter.removeOne(state, payload.targetId);
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            ChannelApi.endpoints.createChannel.matchFulfilled,
            (state, { payload }: PayloadAction<IChannel>) => {
                channelAdapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            ChannelApi.endpoints.updateChannel.matchFulfilled,
            (state, { payload }: PayloadAction<IChannel>) => {
                channelAdapter.upsertOne(state, payload);
            },
        );
    },
});

export const {
    subcribeOnChannel,
    reciveChannelInfo,
    unsubscribeFromChannel,

} = ChannelSlice.actions;

export const {
    selectById: selectChannelById,
    selectIds: selectChannelIds,
    selectEntities: selectChannelEntities,
    selectAll: selectAllChannels,
    selectTotal: selectTotalChannels,
} = channelAdapter.getSelectors((state: RootState) => state.channel);