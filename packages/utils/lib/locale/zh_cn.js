module.exports = {
    welcome: '欢迎使用前端研发脚手架',
    nodeVersionIsTooLow: 'Nodejs版本太低，至少需要',
    notHomeDir: '当前登录用户主目录不存在！',
    startInputParameters: '开始校验输入参数！',
    inputParameters: '输入参数',
    startCheckingEnv: '开始检查环境变量',
    environment:  '环境变量',
    checkLatestVersionCli: '检查 cli 最新版本',
    updateCliVersion: (name, version, lastVersion) => `请手动更新 ${name}，当前版本：${version}，最新版本：${lastVersion}更新命令： npm install -g ${name}`
}
