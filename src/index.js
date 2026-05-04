/**
 * @file
 * @author Tomáš Chochola <tomaschochola@tomaschochola.cz>
 * @copyright © 2026 Tomáš Chochola <tomaschochola@tomaschochola.cz>
 *
 * @license CC-BY-ND-4.0
 *
 * @see {@link https://creativecommons.org/licenses/by-nd/4.0/} License
 * @see {@link https://github.com/tomaschochola} GitHub Profile
 * @see {@link https://github.com/sponsors/tomaschochola} GitHub Sponsors
 */

export class Stylelint {
  config;

  constructor() {
    this.config = {
      extends: [],
      rules: {},
    };
  }

  get NODE_ENV() {
    return process.env.NODE_ENV;
  }

  replaceConfig(config) {
    this.config = { ...config };

    return this;
  }

  configStandardScss(options = {}) {
    return this.replaceConfig({
      ...this.config,
      extends: [
        ...this.config.extends,
        'stylelint-config-standard-scss',
      ],
      ...options,
    });
  }

  configPrettierRecommended(options = {}) {
    return this.replaceConfig({
      ...this.config,
      extends: [
        ...this.config.extends,
        'stylelint-prettier/recommended',
      ],
      ...options,
    });
  }

  configPrettierDisabledRule(options = {}) {
    return this.replaceConfig({
      ...this.config,
      rules: {
        ...this.config.rules,
        'prettier/prettier': null,
      },
      ...options,
    });
  }

  presetDefaults(options = {}) {
    const {
      configStandardScss = true,
      configPrettierRecommended = true,
      configPrettierDisabledRule = true,
    } = options;

    let stylelint = this;

    if (configStandardScss) {
      stylelint = stylelint.configStandardScss();
    }

    if (configPrettierRecommended) {
      stylelint = stylelint.configPrettierRecommended();
    }

    if (configPrettierDisabledRule) {
      stylelint = stylelint.configPrettierDisabledRule();
    }

    return stylelint;
  }

  buildConfig() {
    return { ...this.config };
  }
}
