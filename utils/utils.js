const moment = require('moment');

const formatMessage = (id, username, text) => {
  return {
    id,
    username,
    text,
    time: `[${moment().format('L')} ${moment().format('LTS')}]`
  }
};

module.exports = {
  formatMessage,
}