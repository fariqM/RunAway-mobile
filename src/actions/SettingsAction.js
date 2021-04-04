export const UPDATE_ALL_SETTINGS = "UPDATE_ALL_SETTINGS"
export const RESET_ALL_SETTINGS = "RESET_ALL_SETTINGS"

export const updateAllSettingsAction = (settings) => {
    return {
        type: UPDATE_ALL_SETTINGS,
        display_calories: settings.display_calories,
        display_distance: settings.display_distance,
        display_pace: settings.display_pace,
        display_time: settings.display_time,
        metric: settings.metric,
        update_frequency: settings.update_frequency,
    }
}

export const resetAllSettingsAction = () => {
    return {
        type: RESET_ALL_SETTINGS,
    }
}