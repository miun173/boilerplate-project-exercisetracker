module.exports = {
    // date is in format = yyyy-mm-dd
    dateToUnix: (date) => (new Date(date + "T00:00:00")).getTime(),
    unixToDate: (unixTime) => (new Date(unixTime))
}