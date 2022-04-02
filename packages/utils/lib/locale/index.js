function getEnvLocale(env) {
    env = env || process.env;
    return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
}

function loadLocale() {
    const locale = getEnvLocale();
    if (locale) {
      const localeShortName = locale.split('.')[0].toLocaleLowerCase();
      return require(`./${localeShortName}`);
    } else {
      return require('./zh_cn');
    }
}
  
module.exports = loadLocale();
  