require('dotenv').config()

const e = process.env

const isTrueSet = value => value === 'true'

export const env = {
  STAGE: e.STAGE,
}
