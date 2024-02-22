# Mono Example (UI)

hhh
当前项目是模版项目，旨在为快速搭建小型前端组件库提供模版功能。
似懂非懂舒服
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

增加新 package

```bash
yarn pkgadd new-package
```

本地开发

```bash
yarn dev
```

其余功能可以使用`Lerna`提供的功能。

## Q&A

Q: 在`yarn pkgadd`后，playgound 中引入该包，无法直接索引到文件。

A: 这来源于两个原因：

1. 在当前方案中，playground 的 vite 的配置是在开发开始时动态注入进去，这意味着如果增减包的时候需要重新启动 playground.
2. 在当前方案中，typescript 的索引需要通过 package.json 中的 types 字段，这意味着在 ide 中索引新增包的时候，需要该包先 build，以提供 dist/src/index.d.ts 和对应的 sourcemap.

Q: 如何统一配置各个包的 package.json

A: 在使用`yarn pkgadd`的过程中，会统计将当前项目根目录的 name 用作 scope，并保证`lincese`,`description`和`keywords`字段的一致性。

## License

[MIT](https://choosealicense.com/licenses/mit/)
