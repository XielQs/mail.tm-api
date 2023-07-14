export default function formatDates (data: any): any {
  if (data === null || data === undefined) {
    return data
  }

  const dates = ['createdAt', 'updatedAt'];

  for (const date of dates) {
    data[date + 'Timestamp'] = data[date]
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete data[date]
  }

  return data
}
