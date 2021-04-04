const HEIGHT_RATIO = 0.393701;
const WEIGHT_RATIO = 0.453592;

export const convertInchesToCentimeters = (inches) => {
    // cm = in / 0.393701
    console.log("ConversionFunctions: convertInchesToCentimeters ( inches=", inches,")")
    return Math.round(inches / HEIGHT_RATIO)
}

export const convertCentimetersToInches = (centimeters) => {
    // in = cm * 0.393701
    console.log("ConversionFunctions: convertCentimetersToInches ( inches=", centimeters,")")
    return Math.round(centimeters * HEIGHT_RATIO) 
}

export const convertPoundsToKilograms = (pounds) => {
    // kg = lb * 0.453592
    console.log("ConversionFunctions: convertPoundsToKilograms ( pounds=", pounds,")")
    return Math.round(pounds * WEIGHT_RATIO)
}

export const convertKilogramsToPounds = (kilograms) => {
    // lb = km / 0.453592
    console.log("ConversionFunctions: convertKilogramsToPounds ( kilograms=", kilograms,")")
    return Math.round(kilograms / WEIGHT_RATIO) 
}