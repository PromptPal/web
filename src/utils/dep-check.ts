export function calcId(data?: { id: number }[]) {
  return (
    data?.reduce((acc, cur) => {
      acc += cur.id
      return acc
    }, 0) ?? 0
  )
}
