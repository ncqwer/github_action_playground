# Mono Example (UI)

当前项目是模版项目，旨在为快速搭建小型前端组件库提供模版功能。

当前项目默认技术栈为：
- UI: [React](https://reactjs.org/)
- 构建：[Vite(esbuild)](https://vitejs.dev/) + [Typescript](https://www.typescriptlang.org/)
- Monorepo 管理：[Lerna](https://github.com/lerna/lerna) + [Yarn@v1](https://classic.yarnpkg.com/lang/en/)
- 样式: [Tailwindcss](https://tailwindcss.com/)

## 使用方式

```bash
git clone --depth 1 git@github.com:ncqwer/mono-example.git your-ui-package 
cd your-ui-package
rm -rf .git
git init -b main
yarn
```

## 常用脚本

增加开发工具库

```bash
yarn devaadd toolcli
```

增加新package
```bash
yarn pkgadd new-package
```

本地开发
```bash
yarn dev
```

其余功能可以使用`Lerna`提供的功能。

## Q&A

Q: 在`yarn pkgadd`后，playgound中引入该包，无法直接索引到文件。

A: 这来源于两个原因：

1. 在当前方案中，playground的vite的配置是在开发开始时动态注入进去，这意味着如果增减包的时候需要重新启动playground.
2. 在当前方案中，typescript的索引需要通过package.json中的types字段，这意味着在ide中索引新增包的时候，需要该包先build，以提供dist/src/index.d.ts和对应的sourcemap.

Q: 如何统一配置各个包的package.json

A: 在使用`yarn pkgadd`的过程中，会统计将当前项目根目录的name用作scope，并保证`lincese`,`description`和`keywords`字段的一致性。



## License
[MIT](https://choosealicense.com/licenses/mit/)
