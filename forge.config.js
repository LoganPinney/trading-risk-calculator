const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './assets/icon', // Path to your app icon (without extension)
    name: 'Trading App',
    executableName: 'trading-app',
    appBundleId: 'com.tradingapp.desktop',
    appCategoryType: 'public.app-category.finance',
    win32metadata: {
      CompanyName: 'Trading App Inc.',
      FileDescription: 'Professional Trading Application',
      ProductName: 'Trading App'
    }
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'trading-app',
        setupIcon: './assets/icon.ico',
        loadingGif: './assets/loading.gif'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        maintainer: 'Trading App Inc.',
        homepage: 'https://tradingapp.com'
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        maintainer: 'Trading App Inc.',
        homepage: 'https://tradingapp.com'
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        background: './assets/dmg-background.png',
        format: 'ULFO'
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    },
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer/index.js',
              name: 'main_window',
              preload: {
                js: './src/preload.js'
              }
            }
          ]
        }
      }
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true
    })
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'your-username',
          name: 'trading-app'
        },
        prerelease: false,
        draft: true
      }
    }
  ]
};