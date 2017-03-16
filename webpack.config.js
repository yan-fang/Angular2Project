module.exports = function (env = {mode: 'jit'}) {
  return require('./build-config/' + env.mode + '.js')(env)
};
