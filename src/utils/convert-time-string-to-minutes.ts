export function convertTimeStringToMinutes(timeString: string) {
  const [hours, minutes] = timeString.split(':').map(Number) //  const [] = timeString.split(':').map(item => Number(item));

  return hours * 60 + minutes
}
