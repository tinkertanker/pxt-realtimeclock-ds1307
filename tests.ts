// tests go here; this will not be compiled when this package is used as a library
input.onButtonPressed(Button.A, function () {
    RTC_DS1307.DateTime(
    2019,
    1,
    17,
    12,
    31,
    19
    )
})
basic.forever(function () {
    basic.showNumber(RTC_DS1307.getTime(RTC_DS1307.TimeType.SECOND))
})
