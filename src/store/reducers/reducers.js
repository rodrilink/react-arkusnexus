import { combineReducers } from 'redux';

import settingsReducer from './settings.reducer.js';
import themesReducer from './themes.reducers.js';
import languagesReducer from './i18n.reducer.js';

export default combineReducers({
    settings: settingsReducer,
    theme: themesReducer,
    languages: languagesReducer
});
