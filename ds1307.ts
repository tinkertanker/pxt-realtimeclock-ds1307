
/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */

/**
 * RTC_DS1307 block
 */
//% weight=0 color=#f3555a icon="\uf017" block="RTC1307"
namespace RTC_DS1307 {
    export enum TimeType {
        //% block="second" enumval=0
        SECOND,
        //% block="minute" enumval=1
        MINUTE,
        //% block="hour" enumval=2
        HOUR,
        //% block="day" enumval=3
        DAY,
        //% block="month" enumval=4
        MONTH,
        //% block="year" enumval=5
        YEAR
    }


    let DS1307_I2C_ADDR = 0x68;
    let DS1307_REG_SECOND = 0
    let DS1307_REG_MINUTE = 1
    let DS1307_REG_HOUR = 2
    let DS1307_REG_WEEKDAY = 3
    let DS1307_REG_DAY = 4
    let DS1307_REG_MONTH = 5
    let DS1307_REG_YEAR = 6
    let DS1307_REG_CTRL = 7
    let DS1307_REG_RAM = 8

    /**
     * set ds1307's reg
     */
    function setReg(reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(DS1307_I2C_ADDR, buf);
    }

    /**
     * get ds1307's reg
     */
    function getReg(reg: number): number {
        pins.i2cWriteNumber(DS1307_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(DS1307_I2C_ADDR, NumberFormat.UInt8BE);
    }

    /**
     * convert a Hex data to Dec
     */
    function HexToDec(dat: number): number {
        return (dat >> 4) * 10 + (dat % 16);
    }

    /**
     * convert a Dec data to Hex
     */
    function DecToHex(dat: number): number {
        return Math.idiv(dat, 10) * 16 + (dat % 10)
    }

    /**
     * set time
     */
    //% blockId="DS1307_SET_TIME" 
    //% block="set %datatype |%data"
    export function setTime(datatype: TimeType, data: number): void {
        switch (datatype) {
            case 0:
                setReg(DS1307_REG_SECOND, DecToHex(data % 60))
                break
            case 1:
                setReg(DS1307_REG_MINUTE, DecToHex(data % 60))
                break
            case 2:
                setReg(DS1307_REG_HOUR, DecToHex(data % 24))
                break
            case 3:
                setReg(DS1307_REG_DAY, DecToHex(data % 32))
                break
            case 4:
                setReg(DS1307_REG_MONTH, DecToHex(data % 13))
                break
            case 5:
                setReg(DS1307_REG_YEAR, DecToHex(data % 100))
                break
            default:
                break

        }
    }


    /**
     * get time
     */
    //% blockId="DS1307_GET_TIME" 
    //% block="%data"
    export function getTime(data: TimeType): number {
        switch (data) {
            case 0:
                return HexToDec(getReg(DS1307_REG_SECOND))
                break
            case 1:
                return HexToDec(getReg(DS1307_REG_MINUTE))
                break
            case 2:
                return HexToDec(getReg(DS1307_REG_HOUR))
                break
            case 3:
                return HexToDec(getReg(DS1307_REG_DAY))
                break
            case 4:
                return HexToDec(getReg(DS1307_REG_MONTH))
                break
            case 5:
                return (HexToDec(getReg(DS1307_REG_YEAR)) + 2000)
                break
            default:
                return 0

        }
    }

    

    /**
     * get time
     */
    //% blockId="DS1307_GET_TIME" 
    //% block="%data"

    /**
     * get  weekday
     * 0 means Sunday
     * 1 means Monday
     * 2 means Tuesday
     * 3 means Wednesday
     * 4 means Thursday
     * 5 means Friday
     * 6 means Saturday
     */
    //% blockId="DS1307_GET_WEEKDAY" 
    //% block="weekday"
    export function getWeekday(): number {
        // (d+2*m+3*(m+1)/5+y+y/4-y/100+y/400) mod 7
        let d = HexToDec(getReg(DS1307_REG_DAY))
        let m = HexToDec(getReg(DS1307_REG_MONTH))
        let y = (HexToDec(getReg(DS1307_REG_YEAR)) + 2000)
        if (m < 3) {
            y = y - 1
            m = m + 12
        }

        let w = d
            + 2 * m
            + Math.idiv(3 * (m + 1), 5)
            + y
            + Math.idiv(y, 4)
            - Math.idiv(y, 100)
            + Math.idiv(y, 400)
            + 1
        return w % 7
    }


    




    /**
     * set Date and Time
     * @param year is the Year will be set, eg: 2019
     * @param month is the Month will be set, eg: 1
     * @param day is the Day will be set, eg: 17
     * @param hour is the Hour will be set, eg: 12
     * @param minute is the Minute will be set, eg: 31
     * @param second is the Second will be set, eg: 19
     */
    //% blockId="DS1307_SET_DATETIME" 
    //% block="set year %year|    month %month|      day %day|     hour %hour|   minute %minute|   second %second"
    export function DateTime(year: number, month: number, day: number, hour: number, minute: number, second: number): void {
        let buf = pins.createBuffer(8);
        buf[0] = DS1307_REG_SECOND;
        buf[1] = DecToHex(second % 60);
        buf[2] = DecToHex(minute % 60);
        buf[3] = DecToHex(hour % 24);
        //buf[4] = DecToHex(weekday % 8);
        buf[5] = DecToHex(day % 32);
        buf[6] = DecToHex(month % 13);
        buf[7] = DecToHex(year % 100);
        pins.i2cWriteBuffer(DS1307_I2C_ADDR, buf)
    }







}
