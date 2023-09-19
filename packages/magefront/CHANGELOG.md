# magefront

## 2.0.0

### Major Changes

- d81251b: Move codebase to JS (with JSDoc)
- d8c4fe8: Update the CLI, so it can build multiple themes
  Also configuration is now properly merged, even if you don't provide a theme
  Updated the colors of the CLI

### Minor Changes

- ecfdec5: Implement a more extensible plugin format
- 987b28b: Validate user configuration file

### Patch Changes

- Updated dependencies [d81251b]
- Updated dependencies [c664d24]
  - magefront-preset-default@2.0.0

## 1.2.2

### Patch Changes

- Updated dependencies [4f09f9d]
  - magefront-preset-default@1.3.0

## 1.2.1

### Patch Changes

- magefront-preset-default@1.2.1

## 1.2.0

### Minor Changes

- f8da0cb: Write types statically to reduce build time and overhead
- f8da0cb: Set a proper (peer) dependency version in packages

### Patch Changes

- Updated dependencies [f8da0cb]
  - magefront-preset-default@1.2.0

## 1.1.1

### Patch Changes

- 3a6498e: Update exports and exported types
- 5fbff09: Fix preset loading in config file

## 1.1.0

### Minor Changes

- 9d2b2b5: Restore config file support for CLI.

### Patch Changes

- Updated dependencies [4cc6bd1]
  - magefront-preset-default@1.1.0

## 1.0.0

### Major Changes

- Release 1.0

### Minor Changes

- 3b70273: Update the global workflow by adding context to actions.
  - Now exports a `magefront` function for programmatic use.
  - Improve type definitions.
  - Encapsulate the whole thing to avoid polluting the global scope.

### Patch Changes

- 886c513: Update dependencies to latest version
- Updated dependencies [129c7ba]
- Updated dependencies
  - magefront-preset-default@1.0.0

## 0.24.3

### Patch Changes

- Updated dependencies [8784523]
  - magefront-preset-default@0.4.0
