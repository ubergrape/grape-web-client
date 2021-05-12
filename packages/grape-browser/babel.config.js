module.exports = api => {
  api.cache(true)
  return {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-class-properties',
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: false }],
      [
        'react-intl',
        {
          messagesDir: './i18n',
        },
      ],
    ],
  }
}
