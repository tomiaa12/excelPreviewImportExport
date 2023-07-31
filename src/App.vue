<script setup lang="ts">
import { ref } from "vue";
import { loadPlugins } from "./utils";
import axios from "axios";
import LuckyExcel from "luckyexcel"; // ts 类型 在 env.d.ts 定义了

// @ts-expect-error 不检测下面这一行 ts 类型
import { exportExcel } from './exportExcel.js';

const isLoadingPlugins = ref(false); // 插件加载状态
const fileURL = ref(''); // 远程链接

loadPlugins()
  .then(() => {
    console.log(luckysheet); // window.luckysheet  ts 类型 在 env.d.ts 定义了
    isLoadingPlugins.value = true;
  })
  .catch((res) => {
    console.log("插件加载失败，请刷新后重试！");
  });

const getOriginFile = () => {
  if(!fileURL.value) return console.log('没有输入地址！')
  console.log("正在下载文件...");
  axios({
    url: fileURL.value,
    responseType: "blob",
  })
    .then(({ data }) => {
      const blob = new Blob([data]);
      const file = new File([blob], 'fileName文件名称');
      init(file); // 开始渲染
    })
    .catch((e) => {
      console.log("文件解析失败，请下载后使用 Excel 打开或点击重试！");
    });
};

const previewLocal = (e: any) => {
  const file = e.target.files[0]
  if(!file) return console.log('没有选中文件')
  init(file)
}

const init = (file: File) => {
  if(!isLoadingPlugins.value) return console.log('插件没有加载完成，刷新或重新调用加载方法。')
  luckysheet.destroy(); // 先销毁当前容器
  LuckyExcel.transformExcelToLucky(file, (exportJson: any) => {
    if (exportJson.sheets === null || !exportJson.sheets.length) {
      console.log("无法读取excel文件的内容，当前不支持xls文件！");
      return;
    }
    luckysheet.create({
      container: "luckysheet",
      showinfobar: false,
      lang: "zh",
      data: exportJson.sheets,
      title: exportJson.info.name,
      userInfo: exportJson.info.name.creator,
    });
  });
};

const exportFile = () => {
  exportExcel(luckysheet.getAllSheets(), 'fileName');
};

</script>

<template>
  <div class="control">
    <p>
      在线链接: <input type="text" v-model="fileURL" placeholder="输入在线地址" >
      <button @click="getOriginFile">预览链接文件</button>
    </p>
    <p>
      本地文件(.xlsx格式) :<input type="file" @change="previewLocal">
    </p>
    <p><button @click="exportFile">导出当前表格</button></p>
    <p>没有做loading处理，请打开控制台查看打印信息</p>
  </div>
  <!-- 用于渲染表格的容器 -->
  <div id="luckysheet"></div>
</template>

<style>
* {
  padding: 0;
  margin: 0;
}
html,body{
  width: 100%;
  height: 100%;
}
#app{
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: rgb(245, 244, 244);
}
#luckysheet {
  width: 100vw;
  flex: 1;
  box-shadow: inset 0 0 3px #ccc;
}
.control{
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
.control p+p {
  margin-left: 10px;
  padding-left: 10px;
  border-left: 1px solid #ccc;
}
</style>
