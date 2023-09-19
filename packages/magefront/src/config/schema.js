import Joi from 'joi'

export const pluginSchema = Joi.alternatives().try(
  Joi.string(),
  Joi.object({
    name: Joi.string().required(),
    build: Joi.func().required(),
  }),
  Joi.array().items(Joi.string(), Joi.any())
)

export const presetSchema = Joi.alternatives().try(
  Joi.string(),
  Joi.object({
    plugins: Joi.array().items(pluginSchema).required(),
  }),
  Joi.array().items(Joi.string(), Joi.any())
)

const optionsSchema = Joi.object({
  theme: Joi.string(),
  locale: Joi.string(),
  presets: Joi.array().items(presetSchema),
  plugins: Joi.array().items(pluginSchema),
  magento: Joi.object({
    rootPath: Joi.string(),
  }),
})

const configSchema = Joi.alternatives().try(
  optionsSchema,
  Joi.array().items(optionsSchema)
)

/**
 * Validate the given config.
 *
 * @param {any} config
 * @returns {void}
 * @throws {Joi.ValidationError}
 */
export function validateConfig(config) {
  const { error } = configSchema.validate(config)
  if (error) {
    throw error
  }
}
