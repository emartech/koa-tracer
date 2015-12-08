var i = 1;

module.exports = function(params, options, client, callback) {
  options.headers['x-request-id'] = i++;
  var request = client(options, callback);
  request.write('');
  return request;
};
