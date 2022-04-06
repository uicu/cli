module.exports =  function exec(command, args, options) {
    const win32 = process.platform === 'win32';
  
    const cmd = win32 ? 'cmd' : command;
    const cmdArgs = win32 ? ['/c'].concat(command, args) : args;
  
    return require('child_process').spawn(cmd, cmdArgs, options || {});
}