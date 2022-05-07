const { request } = require('@uicu/cli-utils');

module.exports = function() {
  return request({
    url: '/project/template',
  });
};
