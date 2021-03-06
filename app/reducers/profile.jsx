import * as TYPES from '../actiontypes';
import { initialState } from '../constants/profile';

export default (state = initialState, action) => {
    switch(action.type) {
        case TYPES.EDIT_PROFILE:
            return {
                ...state,
                editingProfile: state.profileUser
            };
        case TYPES.UPDATE_PROFILE:
            return {
                ...state,
                profileUser: action.payload || state.editingProfile,
                editingProfile: null
            };
        case TYPES.CHANGE_PROFILE:
            const editingProfile = {...state.editingProfile, [action.field]: action.payload}
            return {
                ...state,
                editingProfile
            };
        default:
            return state;
    }
}
