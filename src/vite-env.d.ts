/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // 更多环境变量...
  readonly VITE_HOST: string;
  readonly VITE_PORT: number;
  readonly VITE_BASE_URL: string;
  readonly VITE_PROXY_DOMAIN: string;
}
