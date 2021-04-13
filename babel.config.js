module.exports = api => {
  api.cache(true)
  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-react',
  ]

  const plugins = [
    'macros',
    'transform-react-stateless-component-name',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    [
      'react-intl',
      {
        messagesDir: './i18n',
      },
    ],
  ]
  const env = {
    production: {
      plugins: [
        'transform-react-remove-prop-types',
        '@babel/plugin-transform-react-constant-elements',
      ],
    },
  }

  return {
    presets,
    plugins,
    env,
  }
}
