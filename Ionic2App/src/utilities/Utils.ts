export class Utils {
	static ISODateString(d) {
    function pad(n) {
      return n<10 ? '0'+n : n
    }
    return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z';
  }

  static extractTime(date: Date) {
    return (date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()) + 'H' + (date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes());
  }
}