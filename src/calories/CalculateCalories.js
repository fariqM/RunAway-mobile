//weight in kg
//avgSpeed in km/hr
//time in minutes
export default function calculateCalories(weight, avgSpeed, time) {
    let met = 0
    if (avgSpeed < 1.6) {
        met = 1
    }
    else if (1.6 <= avgSpeed && avgSpeed < 3.2) {
        met = 2
    }
    else if (3.2 <= avgSpeed && avgSpeed < 4.02) {
        met = 2.75
    }
    else if (4.02 <= avgSpeed && avgSpeed < 4.82) {
        met = 3
    }
    else if (4.82 <= avgSpeed && avgSpeed < 5.68) {
        met = 4
    }
    else if (5.68 <= avgSpeed && avgSpeed < 6.43) {
        met = 5
    }
    else if (6.43 <= avgSpeed && avgSpeed < 8.04) {
        met = 6.5
    }
    else if (8.04 <= avgSpeed && avgSpeed < 8.36) {
        met = 8.3
    }
    else if (8.36 <= avgSpeed && avgSpeed < 9.65) {
        met = 9
    }
    else if (9.65 <= avgSpeed && avgSpeed < 10.78) {
        met = 9.8
    }
    else if (10.78 <= avgSpeed && avgSpeed < 11.26) {
        met = 10.5
    }
    else if (11.26 <= avgSpeed && avgSpeed < 12.07) {
        met = 11
    }
    else if (12.06 <= avgSpeed && avgSpeed < 12.87) {
        met = 11.5
    }
    else if (12.87 <= avgSpeed && avgSpeed < 13.84) {
        met = 11.8
    }
    else if (13.84 <= avgSpeed && avgSpeed < 14.48) {
        met = 12.3
    }
    else if (14.48 <= avgSpeed && avgSpeed < 16.09) {
        met = 12.8
    }
    else if (16.09 <= avgSpeed && avgSpeed < 17.70) {
        met = 14.5
    }
    else if (17.70 <= avgSpeed && avgSpeed < 19.31) {
        met = 16
    }
    else if (19.31 <= avgSpeed && avgSpeed < 20.92) {
        met = 19
    }
    else if (20.92 <= avgSpeed && avgSpeed < 22.53) {
        met = 19.8
    }
    else {
        met = 23
    }
    return (weight * met * time/60)
}// JavaScript source code
