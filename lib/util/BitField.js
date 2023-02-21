export default class BitField {
  constructor (bitfield) {
    this.bitfield = bitfield
  }

  parse (flags) {
    return Object.entries(this.bitfield)
      .reduce((entries, [field, bit]) => {
        if ((flags & bit) === bit) {
          entries.push(field)
        }

        return entries
      }, [])
  }
}
