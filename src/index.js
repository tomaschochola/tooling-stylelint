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

  replace(config) {
    this.config = { ...config };

    return this;
  }

  standard(options = {}) {
    return this.replace({
      ...this.config,
      extends: [
        ...this.config.extends,
        'stylelint-config-standard-scss',
      ],
      ...options,
    });
  }

  prettier(options = {}) {
    return this.replace({
      ...this.config,
      extends: [
        ...this.config.extends,
        'stylelint-prettier/recommended',
      ],
      rules: {
        ...this.config.rules,
        'prettier/prettier': null,
      },
      ...options,
    });
  }

  build() {
    return { ...this.config };
  }
}
