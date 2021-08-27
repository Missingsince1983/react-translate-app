import React, { FC, useState, useEffect } from "react";
import { TranslateHeader } from './TranslateHeader'
import { TranslateTrack } from './TranslateTrack'
import { useQuery } from '@apollo/client'
import { GET_SENTENCE } from "../query/sentence";
export const Translate: FC = () => {
const { data, loading, error } = useQuery(GET_SENTENCE)
const [sentence, setSentence] = useState<Array<string>>([]);
  useEffect(() => {
    if (!loading) {
      setSentence(data.sentence.en.split(' '))
    }
  }, [data]);
  return (
    <div>
      <TranslateHeader />
      <TranslateTrack />
    </div>
  )
}
