import { CHANGE_THEME } from '../actions/actions';

const initialTheme = {
    path: ''
}

const themesReducer = (state = initialTheme, action) => {
    switch (action.type) {
        case CHANGE_THEME:
            return {
                ...state,
                path: action.path
            }
        default:
            return state;
    }
}

export default themesReducer;