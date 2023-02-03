const Just = value => ({
  isJust: () => true,
  isNothing: () => false,

  map: fn => Maybe(fn(value)),
  flatMap: fn => fn(value),
  getOr: () => value
})

const Nothing = () => ({
  isJust: () => false,
  isNothing: () => true,

  map: () => Nothing(),
  flatMap: () => Nothing(),
  getOr: defaultValue => defaultValue
})

export const Maybe = value => {
  if (value === null || value === undefined) {
    return Nothing()
  }

  return Just(value)
}
