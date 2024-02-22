import react from '@vitejs/plugin-react';

import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

const require = (path: string) => {
  try {
    const content = fs.readFileSync(path, { encoding: 'utf-8' });
    return JSON.parse(content);
  } catch {
    return {};
  }
};

const watchWorkspaces = (rootPath: string): Plugin => {
  return {
    name: '@lla_internal/vite-plugin-watch-source',
    config: (userConfig) => {
      const modifiedConfig = {
        ...userConfig,
        resolve: {
          ...userConfig?.resolve,
          alias: {
            ...Object.fromEntries(
              getPackages(rootPath).reduce(
                (acc: any, pkg: any) =>
                  acc.concat([
                    [
                      `${pkg.name}/style`,
                      path.join(pkg.name, 'style/index.css'),
                    ],
                    [pkg.name, path.join(pkg.name, pkg.source)],
                  ]),
                [] as any,
              ),
            ),
            ...userConfig?.resolve?.alias,
          },
        },
      };

      // eslint-disable-next-line no-console
      console.log('Automatic aliases:', modifiedConfig.resolve.alias);

      return modifiedConfig;
    },
  };

  function getPackages(rootPath: string) {
    const rootPkg = require(path.resolve(
      process.cwd(),
      rootPath,
      'package.json',
    ));

    const folders = rootPkg.workspaces.flatMap((workspace: string) => {
      if (workspace.includes('/*')) {
        const folderWithWorkspaces = workspace.replace('/*', '');
        const workspacesFolders = fs.readdirSync(
          path.resolve(process.cwd(), rootPath, folderWithWorkspaces),
        );
        return workspacesFolders.map((folderName) =>
          path.join(folderWithWorkspaces, folderName),
        );
      }
      return workspace;
    });

    const folderPaths = folders.map((folder: string) =>
      path.resolve(process.cwd(), rootPath, folder),
    );

    const packages = folderPaths
      .map((folderPath: string) =>
        require(path.resolve(folderPath, 'package.json')),
      )
      .filter((pkg: any) => pkg.source);

    return packages;
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), watchWorkspaces('../')],
});
