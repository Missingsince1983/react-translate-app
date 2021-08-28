import React, { FC, useState, useEffect } from "react";
import { TranslateHeader } from './TranslateHeader'
import { TranslateTrack } from './TranslateTrack'
import { useQuery } from '@apollo/client'
import { GET_SENTENCE } from "../query/sentence";
export const Translate: FC = () => {
const { data, loading, error } = useQuery(GET_SENTENCE)
const [sentence, setSentence] = useState<Array<string>>([]);
const [translate, setTranslate] = useState<Array<string>>([]);
const [shuffled, setShuffled] = useState<Array<string>>([]);

const shuffle = (array: Array<string>) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

  useEffect(() => {
    if (!loading) {
      setSentence(data.sentence.en.split(' '))
      setShuffled(shuffle(data.sentence.en.split(' ')))
      setTranslate(data.sentence.ru.split(' '))
    }
  }, [data]);
  return (
    <div>
      <TranslateHeader wordline={translate}/>
      <TranslateTrack wordline={shuffled} wordtranslate={sentence}/>
    </div>
  )
}
