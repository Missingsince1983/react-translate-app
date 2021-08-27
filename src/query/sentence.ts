import { gql } from '@apollo/client'

export const GET_SENTENCE = gql `
  query {
    sentence {
      en
    }
  }
`

export const GET_TRANSLATE = gql `
  query {
    sentence {
      ru
    }
  }
`