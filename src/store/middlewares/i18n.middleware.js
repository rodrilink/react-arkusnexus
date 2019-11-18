import { CHANGE_LANGUAGE } from '../actions/actions';
import I18nInstance from '../../i18n';

export const updateLanguage = state => {
    I18nInstance.changeLanguage(state.languages.language);
}

/*
    Hook into setting changes in order to change layout.
*/
const languages = store => next => action => {
    let result = next(action);

    if (action.type === CHANGE_LANGUAGE) {
        updateLanguage(store.getState())
    }

    return result;
}

export default languages;