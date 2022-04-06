'use strict';


async function init(options) {
    console.log(options);
    try {
      // 设置 targetPath
      let targetPath = process.cwd();
      console.log(targetPath);
      if (!options.targetPath) {
        options.targetPath = targetPath;
      }
      log.verbose('init', options);
      // 完成项目初始化的准备和校验工作
    //   const result = await prepare(options);
    //   if (!result) {
    //     log.info('创建项目终止');
    //     return;
    //   }
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

module.exports = init;