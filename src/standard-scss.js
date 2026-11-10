import { fileURLToPath } from 'node:url';

import cssConfig from './standard-css.js';

export default Object.freeze({
    ...cssConfig,
    overrides: Object.freeze([
        ...cssConfig.overrides,
        Object.freeze({
            extends: Object.freeze([fileURLToPath(import.meta.resolve('stylelint-config-standard-scss'))]),
            files: Object.freeze(['**/*.scss']),
        }),
    ]),
});
