import React, { FC, useState, useEffect } from "react";
import { useQuery } from '@apollo/client'
import { GET_SENTENCE } from "../query/sentence";
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import styled from 'styled-components';

const TrackWrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 50px auto;
  flex-wrap: wrap;
`
const TrackLineWrapper = styled.div`
  width: 100%;
`

const TrackMainLine = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  min-height: 45px;
  border-top: 1px solid #4b4b4b;
  border-bottom: 1px solid #4b4b4b;
  flex-wrap: wrap;
  margin-bottom: 20px;
`

const TrackLine = styled.div`
  display: flex;
  width: 100%;
  padding: 30px 0;
  min-height: 70px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`
const SentenceTrackItem = styled.div`
  padding: 4px 10px;
  height: 30px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-radius: 13px;
  background-color: #fff;
  box-shadow: 0px 8px 4px -6px rgba(0, 0, 0, 0.25);
  margin: 8px 10px 8px 0;
  cursor: drag;
`

const SentenceTrackItemTop = styled(SentenceTrackItem)`
  box-shadow: none;
  background: transparent;
`

const CheckButton = styled.button`
  box-shadow: none;
  outline: none;
  border: none;
  background-color: #fff;
  width: 100%;
  height: 68px;
  display: flex;
  align-items: center;
  box-shadow: -2px -4px 8px #FFFFFF, 2px 4px 8px rgba(0, 0, 0, 0.2);
  background: #f2f2f2;
  border-radius: 88px;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  justify-content: center;
  color: #999999;
  opcity: 0.8;
  cursor: pointer;
  transition: opacity .15s ease-out, color .15s ease-out;
  &:hover{
    opacity: 1;
    color: #333333;
  }
`

const SortableItem = SortableElement(({value}: {value: string}) =>
  <SentenceTrackItem >
    {value}
  </SentenceTrackItem>
);

const SortableSentenceItem = SortableElement(({value}: {value: string}) =>
  <SentenceTrackItemTop >
    {value}
  </SentenceTrackItemTop>
);

const SortableList = SortableContainer(({words, sentence, isDragging, setIsHoveringWords, setIsHoveringSentence, isHoveringWords}: {words: string[], sentence: string[], isDragging: boolean, setIsHoveringWords: (value: boolean) => void, setIsHoveringSentence: (value: boolean) => void, isHoveringWords: boolean}) => {
  return (
    <TrackLineWrapper>
      <TrackMainLine onMouseEnter={() => setIsHoveringWords(true)}
        onMouseLeave={() => setIsHoveringWords(false)}>
        {words.map((value, index) => (
          <SortableSentenceItem key={`word-${index}`} index={index} value={value} collection="words"/>
        ))}
      </TrackMainLine>
      <TrackLine onMouseEnter={() => setIsHoveringSentence(true)}
        onMouseLeave={() => setIsHoveringSentence(false)}>
        {sentence.map((value, index) => (
          <SortableItem key={`sentence-${index}`} index={words.length + index} value={value} collection="sentence"/>
        ))}
      </TrackLine>
    </TrackLineWrapper>
  );
});

export const TranslateTrack: FC = () => {
  const { data, loading } = useQuery(GET_SENTENCE)
  const [words, setWords] = useState<Array<string>>([]);
  const [sentence, setSentence] = useState<Array<string>>([]);

  useEffect(() => {
    if (!loading) {
      setSentence(data.sentence.en.split(' '))
    }
  }, [data]);


class SortableComponent extends React.Component<{}, {
  isHoveringWords: boolean,
  isHoveringSentence: boolean,
  isDragging: boolean
}> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isHoveringSentence: false,
      isHoveringWords: false,
      isDragging: false
    }
  }

  private onSortEnd = ({oldIndex, newIndex}: {oldIndex: number, newIndex: number}) => {
    const allItems = words.concat(sentence);
    const currentItem = allItems[oldIndex];

    if (this.state.isHoveringWords) {
      if (words.includes(currentItem)) {
        setWords(arrayMove(words, oldIndex, newIndex))
      } else {
        words.splice(newIndex, 0, currentItem);
        sentence.splice(sentence.indexOf(currentItem), 1);
        // setWords([...words])
        // setSentence([...sentence])
      }
    }
    if (this.state.isHoveringSentence) {
      if (sentence.includes(currentItem)) {
        setSentence(arrayMove(sentence, oldIndex, newIndex))
      } else {
        sentence.splice(newIndex, 0, currentItem);
        words.splice(sentence.indexOf(currentItem), 1);
        // setWords([...words])
        // setSentence([...sentence])
      }
    }

    this.setState({
      isDragging: false
    })
  };

  private setIsHoveringWords = (value: boolean) => {
    this.setState({
      isHoveringWords: value
    })
  }

  private setIsHoveringSentence = (value: boolean) => {
    this.setState({
      isHoveringSentence: value
    })
  }

  private updateBeforeSortStart = () => {
    this.setState({
      isDragging: true
    })
  }

  public render() {
    return <SortableList
      words={words}
      sentence={sentence}
      isDragging={this.state.isDragging}
      onSortEnd={this.onSortEnd}
      updateBeforeSortStart={this.updateBeforeSortStart}
      setIsHoveringWords={this.setIsHoveringWords}
      setIsHoveringSentence={this.setIsHoveringSentence}
      isHoveringWords={this.state.isHoveringWords}
      axis="xy"
    />;
  }

}

const playTextToSpeech = (val: string) => {
  const tts = window.speechSynthesis
  const toSpeak = new SpeechSynthesisUtterance(val)
  toSpeak.voice = window.speechSynthesis.getVoices().filter(voice => voice.voiceURI === 'Google US English')[0]
  tts.speak(toSpeak)
}

const checkTranslate = () => {
  playTextToSpeech('TEST SPEECH')
}


  return (
    <TrackWrapper>
      <SortableComponent/>
      <CheckButton onClick={checkTranslate}>Check</CheckButton>
    </TrackWrapper>
  )
}
