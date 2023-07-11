import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Entities, ENTITY_NAMES } from '@shared';



const adapter = createEntityAdapter<Entities.Role.Default>();

const initialState = adapter.getInitialState();

export const RoleSlice = createSlice({
    name: ENTITY_NAMES.ROLE,
    initialState,           
    reducers: {
        upsertOne: (state, { payload }: PayloadAction<Entities.Role.Default>) => {
            adapter.upsertOne(state, payload);
        },
    }, 
    extraReducers(builder) {
        builder.addCase(globalReset, () => {
            return initialState;
        });
    },
});

export const RoleSelectors = adapter.getSelectors((state: RootState) => state.role);