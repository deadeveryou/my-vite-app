// 使用 import.meta.env 来获取环境变量
// 默认的环境变量有五个

// BASE_URL: 公共基础路径
// DEV: 当前环境是否为开发环境
// MODE: 应用运行的模式 , 开发环境模式(development) , 生产环境模式(production)
// PROD: 当前环境是否为生产环境
// SSR: 是否为服务端渲染

// 通过在根目录添加以下文件来自定义环境变量

// .env.production: 表示只有在生产环境下才会被加载的文件
// .env.development: 表示只有在开发环境下才会被加载的文件
// .env: 表示备选环境文件 , 在任何环境下都会被加载

// 只有以 VITE_ 为前缀的变量才可以在程序中使用

import { defineConfig, UserConfigExport } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import {CustomDotenvParseOutput}  from "./src/types/dotenv";
import dotenv, {DotenvParseOutput} from "dotenv";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({command,mode}) => {
   // 获取当前的模式
   console.log("🚀🚀 ~ 打包编译阶段还是编码阶段", command);
   console.log("🚀🚀 ~ 当前在什么环境运行项目", mode);
  // 定义文件前缀
  const envFilePrefix: string = ".env.";
  // 获取当前模式下对应的环境变量文件
  const curEnvFileName = `${envFilePrefix}${mode}`;
  // 读取环境变量文件
  const envData = fs.readFileSync(curEnvFileName);
  // 把读取到的结果解析成对象
  const envMap: DotenvParseOutput = dotenv.parse(envData);
  console.log("🚀🚀 ~ envMap", envMap);

  return {
    plugins: [react()],
    server: {
      host: envMap.VITE_HOST,
      port: envMap.VITE_PORT,
      proxy: {
        [envMap.VITE_BASE_URL]: {
          target: envMap.VITE_PROXY_DOMAIN,
        },
      },
    },
    resolve:{
      alias:{
        "@":path.resolve(__dirname,"src"),
      }
    }
  };
});
