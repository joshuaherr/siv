import Router from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'

import { api } from '../api-helper'

const cookie_name = 'siv-jwt'

export function login(jwt: string) {
  // add cookie
  document.cookie = `${cookie_name}=${jwt};`
  Router.replace('/admin')
}
export function logout() {
  // delete cookie
  document.cookie = `${cookie_name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

export function useLoginRequired(loggedOut: boolean) {
  // If logged out, redirect to Login Screen
  useEffect(() => {
    if (loggedOut) {
      // Do they have an email & auth token in URL?
      const { auth, email } = Router.query
      console.log('line 25')
      if (email && auth) {
        // Validate login auth token on backend
        api('admin-check-login-code', { auth, email }).then((response) => {
          if (response.status === 200) {
            // Set valid session JWT cookie
            return response.json().then(({ jwt }) => login(jwt))
          } else if (response.status === 412) {
            // TODO: Expired session
            // Redirect back to login page, with "This login link has expired, click below to create another."
            // Ideally with their email pre-filled
            return
          } else {
            // Invalid, redirect them to login
            Router.push('/login')
          }
        })
      }
    }
  }, [loggedOut])
}

export function useUser() {
  const { data, error, mutate } = useSWR('/api/validate-admin-jwt', fetcher)

  const loading = !data && !error
  const loggedOut = error && error.status === 403
  console.log({ data, error, loading, loggedOut })

  return {
    loading,
    loggedOut,
    mutate,
    user: data,
  }
}

const fetcher = async (url: string) => {
  const res = await fetch(url)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error((await res.json()).error)
    // Attach extra info to the error object.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    error.status = res.status
    throw error
  }

  return res.json()
}
