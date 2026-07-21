/// <reference types="vite/client" />

declare module '*.css' {
  const content: string
  export default content
}

declare module 'katex/dist/katex.min.css' {
  const content: string
  export default content
}

declare const process: {
  env: {
    NODE_ENV: string
    [key: string]: string | undefined
  }
}
