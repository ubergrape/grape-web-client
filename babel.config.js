module.exports = api => {
  api.cache(true)
  const presets = ['@babel/preset-env']
  const plugins = [
    'macros',
    'transform-decorators-legacy',
    'transform-react-stateless-component-name',
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
        'transform-react-constant-elements',
      ],
    },
  }

  return {
    presets,
    plugins,
    env,
  }
}
