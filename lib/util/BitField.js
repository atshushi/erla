export default class BitField {
  constructor (bitfield) {
    this.bitfield = bitfield
  }

  parse (flags) {
    return Object.entries(this.bitfield)
      .reduce((entries, bitfield) => {
        if ((flags & bitfield[1]) === bitfield[1]) {
          entries.push(bitfield[0])
        }

        return entries
      }, [])
  }
}
