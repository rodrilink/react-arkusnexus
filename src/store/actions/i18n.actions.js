export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';

export function changeLanguage(language) {
    return { type: CHANGE_LANGUAGE, language };
}