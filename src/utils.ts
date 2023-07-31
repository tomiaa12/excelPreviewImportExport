/* 下列代码加载 cdn 文件，你也可以在 public 文件夹在 html 中引入 */
// 封装加载 src 文件方法
export function asynLoad(src : string, isCss = false) {
  return new Promise(res => {
    let el: any;
    if (isCss) {
      el = document.createElement('link');
      el.rel = 'stylesheet';
      el.href = src;
    } else {
      el = document.createElement('script');
      el.src = src;
    }
    document.documentElement.appendChild(el);
    el.onload = el.onreadystatechange = function() {
      if (
        !this.readyState ||
        this.readyState == 'loaded' ||
        this.readyState == 'complete'
      ) {
        res(true);
      }
      this.onload = this.onreadystatechange = null;
    };
  });
}

export const loadPlugins = () => {
  const baseURL = '//cdn.jsdelivr.net/npm/luckysheet@latest/dist';
  console.log('正在加载依赖插件，请耐心等待...');
  return Promise.all([
    asynLoad(`${baseURL}/plugins/css/pluginsCss.css`, true),
    asynLoad(`${baseURL}/plugins/plugins.css`, true),
    asynLoad(`${baseURL}/css/luckysheet.css`, true),
    asynLoad(`${baseURL}/assets/iconfont/iconfont.css`, true),
    asynLoad(`${baseURL}/plugins/js/plugin.js`),
    asynLoad(`${baseURL}/luckysheet.umd.js`)
  ])
}