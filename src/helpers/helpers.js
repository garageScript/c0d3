export const arrUntil = (arr, fn, i = 0) => {
  if (i === arr.length) {
    return null
  }
  if (fn(arr[i], i)) {
    return arr[i]
  }
  return arrUntil(arr, fn, i + 1)
}

export const debounce = (fun, time) => {
  let timer
  return (...a) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fun(...a)
    }, time)
  }
}
