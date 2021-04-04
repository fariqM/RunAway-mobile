const yearRange = () => {
    let startYear = 1950
    let endYear = new Date().getFullYear() - 10
    let years = []
    for (let i = endYear; i >= startYear; i--) {
        years.push({label:String(i),value:String(i)})
    }
    return years
}

const monthRange = () => {
    let startMonth = 1
    let endMonth = 31
    let months = []
    for (let i = startMonth; i <= endMonth; i++) {
        months.push({label:String(i),value:String(i)})
    }
    return months
}


export const months = [
    {label:'January',value:'January'},
    {label:'February',value:'February'},
    {label:'March',value:'March'},
    {label:'April',value:'April'},
    {label:'May',value:'May'},
    {label:'June',value:'June'},
    {label:'July',value:'July'},
    {label:'August',value:'August'},
    {label:'September',value:'September'},
    {label:'October',value:'October'},
    {label:'November',value:'November'},
    {label:'December',value:'December'}
]
export const days = monthRange()
export const years = yearRange()