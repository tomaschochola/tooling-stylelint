# Design

This package exposes explicit Stylelint configuration fragments.

There is no default preset.
Templates must list each layer directly.

Prettier integration is explicit:

1. Add the Prettier recommended Stylelint integration.
2. Disable the `prettier/prettier` rule because Prettier is executed as a separate formatter check.
