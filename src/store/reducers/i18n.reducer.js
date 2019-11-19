import { CHANGE_LANGUAGE } from '../actions/actions';

const initialLanguages = {
    language: 'en'
}

const languagesReducer = (state = initialLanguages, action) => {

    switch (action.type) {
        case CHANGE_LANGUAGE:
            return {
                ...state,
                language: action.language
            }
        default:
            return state;
    }
}

export default languagesReducer;