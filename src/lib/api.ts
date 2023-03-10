import axios from 'axios'
import https from 'https'
import { ExtensionsTypes, UsersTypes } from '../types'
import config from '../../config/monitor_config'
import logger from 'node-color-log'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

/**
 * Get the extensions and the conversations
 * @returns The extensions and the conversations
 */
export async function getExtensions() {
  try {
    const { data } = await axios.get<ExtensionsTypes>(
      `${config.base_api_url}/astproxy/extensions`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `${config.username}:${config.auth_token}`,
        },
        httpsAgent: agent,
      },
    )
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('error message: ', error.message)
      return error.message
    } else {
      logger.error('unexpected error: ', 'error')
      return 'An unexpected error occurred'
    }
  }
}

/**
 * Get all users with extensions
 * @return The extensions and the
 */
export async function getUsers() {
  try {
    const { data } = await axios.get<UsersTypes>(`${config.base_api_url}/user/endpoints/all`, {
      headers: {
        Accept: 'application/json',
        Authorization: `${config.username}:${config.auth_token}`,
      },
      httpsAgent: agent,
    })
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('error message: ', error.message)
    } else {
      logger.error('unexpected error: ', 'error')
      return 'An unexpected error occurred'
    }
  }
}
