import Joi from 'joi'

const MagefrontOptionsSchema = Joi.object({
  theme: Joi.string(),
  locale: Joi.string(),
  presets: Joi.array().items(
    Joi.alternatives().try(
      Joi.string(),
      Joi.object(),
      Joi.array().items(Joi.string(), Joi.any())
    )
  ),
  plugins: Joi.array().items(
    Joi.alternatives().try(
      Joi.string(),
      Joi.object(),
      Joi.array().items(Joi.string(), Joi.any())
    )
  ),
  magento: Joi.object({
    rootPath: Joi.string(),
  }),
})

const ConfigSchema = Joi.alternatives().try(
  MagefrontOptionsSchema,
  Joi.array().items(MagefrontOptionsSchema)
)

/**
 * Validate the given config.
 *
 * @param {any} config
 * @returns {void}
 * @throws {Joi.ValidationError}
 */
export function validateConfig(config) {
  const { error } = ConfigSchema.validate(config)
  if (error) {
    throw error
  }
}
