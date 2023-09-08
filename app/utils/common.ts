import moment from "moment"
import "moment/min/locales"
moment.locale(["vi"])
export const dateYMD = (time: number) => {
  return moment(time).format("YYYY-MM-DD")
}
export const dateYMDStr = (time: string) => {
  return moment(time).format("YYYY-MM-DD")
}
export const dateYMDH = (time: number) => {
  return moment(time).format("YYYY-MM-DD HH:mm")
}
export const dateDMY = (time: number) => {
  return moment(time).format("DD-MM-YYYY")
}
export const dateDMYH = (time: number) => {
  return moment(time).format("DD-MM-YYYY - HH:mm")
}
export const dateDMYStr = (time: string) => {
  return moment(time).format("DD-MM-YYYY")
}
export const dateTimeStamp = (value: string | number): number => {
  return new Date(value).getTime()
}
export const startOfMonth = (value: string): number => {
  const startMonth = parseInt(moment(value).startOf("month").format("x"))

  return startMonth
}
export const endOfMonth = (value: string): number => {
  const endMonth = parseInt(moment(value).endOf("month").format("x"))
  return endMonth
}
export const dateString = (value: string | number) => {
  return moment(value).format("DD/MM/YYYY")
}
export const stringYMD = (value: string) => {
  return moment(value).format("YYYY/MM/DD")
}
export const dateSetHoursMinutes = (value: number) => {
  const currentDate = new Date().setHours(0, 0, 0, 0)
  return moment(currentDate + value).format("HH:mm")
}
export const dateSetHoursMinutesString = (value: string) => {
  const currentDate = new Date().getHours()
  return moment(currentDate + value).format("HH:mm")
}
export const dateMMYY = (value) => {
  return moment(value).format("MM-yyyy")
}
export const dateHHMM = (value: any) => {
  return moment().format("HH:mm")
}
export const dateHHMMSS = (value: any) => {
  return moment(value).format("HH:mm:ss")
}
export const initials = (name) => {
  var initials = (name + "").split(" ") || []
  return (
    (initials[0].charAt(0) || "") + (initials[initials.length - 1].charAt(0) || "")
  ).toUpperCase()
}
export const getHoursMinutesTimeStamp = (value: string | number) => {
  return new Date(value).getTime() - new Date(value).setHours(0, 0, 0, 0)
}
export const formatHHMMTimestamp = (value) => {
  return moment(new Date().setHours(0, 0, 0, 0) + value).format("HH:mm")
}
export const formatHHMM = (value: number) => {
  return moment(value).format("HH:mm")
}
export const testDateToDate = (fromDate: number, toDate: number): boolean => {
  return fromDate <= toDate ? true : false
}

export const timeUnix = (value: number) => {
  const hour = moment.unix(value).format("HH:mm")

  return hour
}
