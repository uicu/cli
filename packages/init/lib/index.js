'use strict';
const fs = require('fs');
const fse = require('fs-extra');
const { log, inquirer } = require('@uicu/cli-utils');
const getProjectTemplate = require('./getProjectTemplate');

const {
  COMPONENT_FILE,
  TYPE_PROJECT,
  TYPE_COMPONENT,
  TEMPLATE_TYPE_NORMAL,
  TEMPLATE_TYPE_CUSTOM
} = require('./const');

const DEFAULT_TYPE = TYPE_PROJECT;

async function init(options) {
    try {
      // 设置 targetPath
      let targetPath = process.cwd();
      if (!options.targetPath) {
        options.targetPath = targetPath;
      }
      log.verbose('init', options);
      // 完成项目初始化的准备和校验工作
      const result = await prepare(options);
      if (!result) {
        log.info('创建项目终止');
        return;
      }
    //   // 获取项目模板列表
    //   const { templateList, project } = result;
    //   // 缓存项目模板文件
    //   const template = await downloadTemplate(templateList, options);
    //   log.verbose('template', template);
    //   if (template.type === TEMPLATE_TYPE_NORMAL) {
    //     // 安装项目模板
    //     await installTemplate(template, project, options);
    //   } else if (template.type === TEMPLATE_TYPE_CUSTOM) {
    //     await installCustomTemplate(template, project, options);
    //   } else {
    //     throw new Error('未知的模板类型！');
    //   }
    } catch (e) {
      if (options.debug) {
        log.error('Error:', e.stack);
      } else {
        log.error('Error:', e.message);
      }
    } finally {
      process.exit(0);
    }
}


async function prepare(options) {
  let fileList = fs.readdirSync(options.targetPath);
  fileList = fileList.filter(file => ['node_modules', '.git', '.DS_Store'].indexOf(file) < 0);
  log.verbose('fileList', fileList);
  let continueWhenDirNotEmpty = true;
  if (fileList && fileList.length > 0) {
    continueWhenDirNotEmpty = await inquirer({
      type: 'confirm',
      message: '当前文件夹不为空，是否继续创建项目？',
      defaultValue: false,
    });
  }
  if (!continueWhenDirNotEmpty) {
    return;
  }
  if (options.force) {
    const targetDir = options.targetPath;
    const confirmEmptyDir = await inquirer({
      type: 'confirm',
      message: '是否确认清空当下目录下的文件',
      defaultValue: false,
    });
    if (confirmEmptyDir) {
      fse.emptyDirSync(targetDir);
    }
  }
  let initType = await getInitType();
  log.verbose('initType', initType);
  // let templateList = await getProjectTemplate();
  // if (!templateList || templateList.length === 0) {
  //   throw new Error('项目模板列表获取失败');
  // }
  // let projectName = '';
  // let className = '';
  // while (!projectName) {
  //   projectName = await getProjectName(initType);
  //   if (projectName) {
  //     projectName = formatName(projectName);
  //     className = formatClassName(projectName);
  //   }
  //   log.verbose('name', projectName);
  //   log.verbose('className', className);
  // }
  // let version = '1.0.0';
  // do {
  //   version = await getProjectVersion(version, initType);
  //   log.verbose('version', version);
  // } while (!version);
  // if (initType === TYPE_PROJECT) {
  //   templateList = templateList.filter(item => item.tag.includes('project'));
  //   return {
  //     templateList,
  //     project: {
  //       name: projectName,
  //       className,
  //       version,
  //     },
  //   };
  // } else {
  //   templateList = templateList.filter(item => item.tag.includes('component'));
  //   let description = '';
  //   while (!description) {
  //     description = await getComponentDescription();
  //     log.verbose('description', description);
  //   }
  //   return {
  //     templateList,
  //     project: {
  //       name: projectName,
  //       className,
  //       version,
  //       description,
  //     },
  //   };
  // }
}


function getInitType() {
  return inquirer({
    type: 'list',
    choices: [{
      name: '项目',
      value: TYPE_PROJECT,
    }, {
      name: '组件',
      value: TYPE_COMPONENT,
    }],
    message: '请选择初始化类型',
    defaultValue: DEFAULT_TYPE,
  });
}


module.exports = init;