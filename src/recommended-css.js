import { fileURLToPath } from 'node:url';

import baseConfig from './base.js';

export default Object.freeze({
    ...baseConfig,
    extends: Object.freeze([...baseConfig.extends, fileURLToPath(import.meta.resolve('stylelint-config-recommended'))]),
});
