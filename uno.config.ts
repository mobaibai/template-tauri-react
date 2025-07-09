import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind3,
  toEscapedSelector,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'flex-center': 'flex justify-center items-center',
      'flex-x-center': 'flex justify-center',
      'flex-y-center': 'flex items-center',
      'flex-end-center': 'flex justify-end items-center',
      'flex-start-center': 'flex justify-start items-center',
      'flex-between-center': 'flex justify-between items-center',
      'flex-around-center': 'flex justify-around items-center',
      'flex-evenly-center': 'flex justify-evenly items-center',
      'flex-col-center': 'flex-center flex-col',
      'flex-col-x-center': 'flex flex-col items-center',
      'flex-col-y-center': 'flex flex-col justify-center',
    },
    {
      'absolute-center': 'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2',
      'absolute-x-center': 'absolute-lt flex-x-center size-full',
      'absolute-y-center': 'absolute-lt flex-y-center size-full',
      'absolute-flex-center':
        'absolute flex-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2',
      'absolute-lt': 'absolute left-0 top-0',
      'absolute-lb': 'absolute left-0 bottom-0',
      'absolute-rt': 'absolute right-0 top-0',
      'absolute-rb': 'absolute right-0 bottom-0',
    },
    {
      'fixed-center': 'fixed-lt flex-center size-full',
      'fixed-x-center': 'fixed-lt flex-x-center size-full',
      'fixed-y-center': 'fixed-lt flex-y-center size-full',
      'fixed-flex-center':
        'fixed flex-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2',
      'fixed-lt': 'fixed left-0 top-0',
      'fixed-lb': 'fixed left-0 bottom-0',
      'fixed-rt': 'fixed right-0 top-0',
      'fixed-rb': 'fixed right-0 bottom-0',
    },
  ],
  rules: [
    [
      /^custom-shadow$/,
      () => ({
        'box-shadow':
          'var(--shadow-enabled) 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      }),
    ],
    /* 彩虹色配置 */
    [
      /^rainbow-(\w+)$/,
      ([, name], { rawSelector, currentSelector, variantHandlers, theme }) => {
        // console.log(name, rawSelector, currentSelector, variantHandlers)
        const selector = toEscapedSelector(rawSelector)
        const color = `var(--rb-brand${rawSelector.includes('dark:rainbow') ? '-dark' : ''})`
        if (name === 'text') {
          return `
            ${selector} {
              color: ${color};
            }
          `
        } else if (name === 'bgc') {
          return `
            ${selector} {
              background-color: ${color};
            }
          `
        } else if (name === 'a') {
          return `
            ${selector} a {
              color: ${color};
            }
          `
        }
      },
    ],
  ],
  presets: [
    presetWind3({
      dark: {
        dark: '[data-theme="dark"]',
        light: '[data-theme="light"]',
      },
    }),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist', '.git', '.vscode', 'public', 'build', 'config'],
    },
  },
})
