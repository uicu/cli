
const fs = require('fs');
const path = require('path');
const semver = require('semver');
const program = require('commander');
const { homedir } =  require('os');
const colors = require('colors/safe');
const { 
  log, 
  locale, 
  npm,
  Package,
  exec
} = require('@uicu/cli-utils');
const packageConfig = require('../package.json');
const {
  LOWEST_NODE_VERSION,
  DEFAULT_CLI_HOME,
  NPM_NAME,
  DEPENDENCIES_PATH
} = require('./const');

const userHome = homedir();
let args;
let config;

async function cli() {
    try {
      await prepare();
      registerCommand();
    } catch (e) {
      log.error(e.message);
      if (program.debug) {
        console.log(e);
      }
    }
}
async function prepare() {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot(); 
    checkUserHome();
    checkInputArgs();
    checkEnv();
    await checkGlobalUpdate();
}

// 检查当前脚手架运行版本
function checkPkgVersion() {
    log.notice('cli', packageConfig.version);
    log.success(locale.welcome);
}

// 检查 node 版本
function checkNodeVersion() {
  // semver是一个语义化版本号管理的模块，可以实现版本号的解析和比较，规范版本号的格式
  if (!semver.gte(process.version, LOWEST_NODE_VERSION)) {
    throw new Error(colors.red(`${locale.nodeVersionIsTooLow}: v${LOWEST_NODE_VERSION}`));
  }
}

// 检查是否为 root 启动
function checkRoot() {
  // 请避免使用 root 账户启动本应用
  const rootCheck = require('root-check');
  rootCheck();
}

// 检查用户主目录
function checkUserHome() {
  if (!userHome || !fs.existsSync(userHome)) {
    throw new Error(colors.red(locale.notHomeDir));
  }
}

// 检查用户输入参数
function checkInputArgs() {
  log.verbose(locale.startInputParameters);
  const minimist = require('minimist');
  args = minimist(process.argv.slice(2)); // 解析查询参数
  checkArgs(args);
  log.verbose(locale.inputParameters, args);
}

 // 校验参数
function checkArgs(args) {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose';
  } else {
    process.env.LOG_LEVEL = 'info';
  }
  log.level = process.env.LOG_LEVEL;
}


// 检查环境变量
function checkEnv() {
  log.verbose(locale.startCheckingEnv);
  // dotenv 它将环境变量中的.env文件内容加载到process.env
  const dotenv = require('dotenv');
  dotenv.config({
    path: path.resolve(userHome, '.env'),
  });
  config = createCliConfig();
  log.verbose(locale.environment, config);
}

// 准备基础配置
function createCliConfig() {
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig['cliHome'] = path.join(userHome, DEFAULT_CLI_HOME);
  }
  return cliConfig;
}

// 检查CLI工具是否需要更新
async function checkGlobalUpdate() {
  log.verbose(locale.checkLatestVersionCli);
  const currentVersion = packageConfig.version;
  const lastVersion = await npm.getNpmLatestSemverVersion(NPM_NAME, currentVersion);
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(colors.yellow(locale.updateCliVersion(NPM_NAME, packageConfig.version, lastVersion)));
  }
}


function registerCommand() {
  // 
  program
    .version(packageConfig.version, '-v, --version')
    .usage('<command> [options]')
    .option('-d, --debug', '是否开启调试模式', false);

  program
    .command('init [type]')
    .description('项目初始化')
    .option('--packagePath <packagePath>', '手动指定init包路径')
    .option('--targetPath <targetPath>', '手动指定初始化目标路径')
    .option('--force', '覆盖当前路径文件（谨慎使用）')
    .action(async (type, { packagePath, force, targetPath }) => {
      const packageName = '@uicu/cli-init';
      const packageVersion = '0.0.4';
      await execCommand({ packagePath, packageName, packageVersion }, { type, force, targetPath });
    });
  
  // 开启debug模式
  program.on('option:debug', function() {});

  // 对未知命令监听
  program.on('command:*', function(obj) {
    const availableCommands = program.commands.map(cmd => cmd.name());
    console.log(colors.red('未知的命令：' + obj[0]));
    if (availableCommands.length > 0) {
      console.log(colors.red('可用命令：' + availableCommands.join(',')));
    }
  });

  program.parse(process.argv);

  if (args._.length < 1) {
    program.outputHelp();
  }
}


async function execCommand({ packagePath, packageName, packageVersion }, extraOptions) {
  let rootFile;
  try {
    if (packagePath) {
      // 指定某个包路径，就在指定路径下找
      const execPackage = new Package({
        targetPath: packagePath,
        storePath: packagePath,
        name: packageName,
        version: packageVersion,
      });
      rootFile = execPackage.getRootFilePath(true);
    } else {
      // 没有指定包路径，在cli家目录下找
      const { cliHome } = config;
      const packageDir = `${DEPENDENCIES_PATH}`;
      const targetPath = path.resolve(cliHome, packageDir);
      const storePath = path.resolve(targetPath, 'node_modules');
      const initPackage = new Package({
        targetPath,
        storePath,
        name: packageName,
        version: packageVersion,
      });
      if (await initPackage.exists()) {
        // 如果找到了就更新
        await initPackage.update();
      } else {
        // 没有找到就安装
        await initPackage.install();
      }
      rootFile = initPackage.getRootFilePath();
    }
    const _config = Object.assign({}, config, extraOptions, {
      debug: args.debug,
    });
    if (fs.existsSync(rootFile)) {
      const code = `require('${rootFile}')(${JSON.stringify(_config)})`;
      const p = exec('node', ['-e', code], { 'stdio': 'inherit' });
      p.on('error', e => {
        log.verbose('命令执行失败:', e);
        handleError(e);
        process.exit(1);
      });
      p.on('exit', c => {
        log.verbose('命令执行成功:', c);
        process.exit(c);
      });
    } else {
      throw new Error('入口文件不存在，请重试！');
    }
  } catch (e) {
    log.error(e.message);
  }
}


function handleError(e) {
  if (args.debug) {
    log.error('Error:', e.stack);
  } else {
    log.error('Error:', e.message);
  }
  process.exit(1);
}



module.exports = cli;