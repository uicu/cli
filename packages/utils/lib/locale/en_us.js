module.exports = {
    welcome: 'Welcome using cli',
    nodeVersionIsTooLow: 'Node version is too low. Minimum requirements',
    notHomeDir: 'The home directory of the currently logged in user does not exist!',
    startInputParameters: 'Start input parameters',
    inputParameters: 'Input parameters',
    startCheckingEnv: 'Start checking environment variables',
    environment:  'Environment variables',
    checkLatestVersionCli: 'Check the latest version of cli',
    updateCliVersion: (name, version, lastVersion) => `Please update ${name} manually, current version: ${version}, latest: ${lastVersion} Update command version: npm install -g ${name}`
}
  