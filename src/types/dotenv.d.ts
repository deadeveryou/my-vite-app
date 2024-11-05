// // src\types\dotenv.d.ts
import "dotenv";
export interface CustomDotenvParseOutput {
  VITE_HOST: string;
  VITE_PORT: number;
  VITE_BASE_URL: string;
  VITE_PROXY_DOMAIN: string;
}

declare module "dotenv" {
  export interface DotenvParseOutput extends CustomDotenvParseOutput {}
}
