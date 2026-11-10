import { fileURLToPath } from 'node:url';

import cssConfig from './recommended-css.js';

export default Object.freeze({
    ...cssConfig,
    overrides: Object.freeze([
        ...cssConfig.overrides,
        Object.freeze({
            extends: Object.freeze([fileURLToPath(import.meta.resolve('stylelint-config-recommended-scss'))]),
            files: Object.freeze(['**/*.scss']),
        }),
    ]),
});
