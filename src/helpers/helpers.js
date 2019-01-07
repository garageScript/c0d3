export const arrUntil = (arr, fn, i = 0) => {
  if (i === arr.length) {
    return null
  }
  if (fn(arr[i], i)) {
    return arr[i]
  }
  return arrUntil(arr, fn, i + 1)
}
