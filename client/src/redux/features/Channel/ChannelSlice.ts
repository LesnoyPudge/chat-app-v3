import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChannel } from '@backendTypes';
import { RootState } from '../../store/store';
import ChannelApi from './ChannelApi';



const channelAdapter = createEntityAdapter<IChannel>();

const initialState = channelAdapter.getInitialState();

export const ChannelSlice = createSlice({
    name: 'channel',
    initialState,           
    reducers: {
        subcribeOnChannel(state, { payload }: PayloadAction<{channelId: string}>) {
            
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
    selectById: selectChannelById,
    selectIds: selectChannelIds,
    selectEntities: selectChannelEntities,
    selectAll: selectAllChannels,
    selectTotal: selectTotalChannels,
} = channelAdapter.getSelectors((state: RootState) => state.channel);