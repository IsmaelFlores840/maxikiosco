import moment from 'moment';

export default class Parser {
  static currency = text => {
    let num = parseFloat(text);
    return (
      '$' + num
        .toFixed(2)
        .replace('.', ',')
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    );
  }

  static date = text => {
    if(!text) { return ''; }
    if(typeof text === 'object'){ return moment(text).format('DD-MM-YYYY'); }
    return !text.startsWith('0001-01-01') ? moment(text).format('DD-MM-YYYY') : ''
  }

  static datetime = text => {
    if(!text) { return ''; }
    if(typeof text === 'object'){ return moment(text).format('DD-MM-YYYY'); }
    return !text.startsWith('0001-01-01') ? moment(text).format('DD-MM-YYYY HH:mm:ss') : ''
  }

  static mask = text => {
    text = text.toString();
    return text ? text.substring(text.length / 2, text.length).padStart(text.length, '*') : '';
  }
}