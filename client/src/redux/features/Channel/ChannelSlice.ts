import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChannel } from '@backendTypes';
import { ChannelApi } from './ChannelApi';
import { RootState } from '@redux/store';



const channelAdapter = createEntityAdapter<IChannel>();

const initialState = channelAdapter.getInitialState();

export const ChannelSlice = createSlice({
    name: 'channel',
    initialState,           
    reducers: {
        subscribeOnChannel(state, { payload }: PayloadAction<string>) {
            console.log(payload);
        },
    },
    extraReducers(builder) {
        builder.addMatcher(
            ChannelApi.endpoints.createChannel.matchFulfilled,
            (state, { payload }: PayloadAction<any>) => {
                console.log(payload);
            },
        );
    },
});

export const {
    subscribeOnChannel,

} = ChannelSlice.actions;

export const {
    selectById: selectChannelById,
    selectIds: selectChannelsIds,
    selectEntities: selectChannelsEntities,
    selectAll: selectAllChannels,
    selectTotal: selectTotalChannels,
} = channelAdapter.getSelectors((state: RootState) => state.channel);