import React, { FC, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import FlipMove from 'react-flip-move';
type Props = {
  wordline: Array<string>,
  wordtranslate: Array<string>
};

type WordObject = {
  item: string,
  order: number
}

const TrackWrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 50px auto 0;
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
  &.dragging-helper-class {
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.25);
    position: absolute;
  }
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

const Error = styled.div`
  width: 100%;
  color: red;
  font-size: 22px;
  line-height: 30px;
  color: red;
  font-weight: bold;
  text-align: center;
  margin: 0 0 40px;
`

export const TranslateTrack: FC<Props> = ({ wordline, wordtranslate }) => {
  const [words, setWords] = useState<Array<WordObject>>([]);
  const [sentence, setSentence] = useState<Array<WordObject>>([]);
  const [translate, setTranslate] = useState<Array<WordObject>>([]);
  const [error, setError] = useState<Boolean>(false);
  useEffect(() => {
    const wordsLine = wordline.map((w, i) => ({
      item: w,
      order: i
    }))
    setSentence(wordsLine)
  }, [wordline]);

const playTextToSpeech = (val: string) => {
  const tts = window.speechSynthesis
  const toSpeak = new SpeechSynthesisUtterance(val)
  toSpeak.voice = window.speechSynthesis.getVoices().filter(voice => voice.voiceURI === 'Google US English')[0]
  tts.speak(toSpeak)
}

const arrayToString = (val: Array<WordObject>): string => {
  let finalStr = ''
  words.map((word, i) => {
    finalStr = finalStr + word.item + (i !== words.length - 1 ? ' ' : '')
  })
  return finalStr
}

const checkTranslate = () => {
  let rightString = ''
  wordtranslate.map((word, i) => {
    rightString = rightString + word + (i !== wordtranslate.length - 1 ? ' ' : '')
  })
  console.log(arrayToString(words),rightString )
  if (arrayToString(words) === rightString) {
    setError(false)
    playTextToSpeech(rightString)
  } else {
    setError(true)
  }
}


const reorder = (list: Array<WordObject>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}

const move = (source: Array<WordObject>, destination: Array<WordObject>, droppableSource: { index: number, droppableId: string }, droppableDestination: { index: number, droppableId: string }) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);

    const result = {}
    // result[droppableSource.droppableId] = sourceClone; 
    // result[droppableDestination.droppableId] = destClone;

    return {sourceClone, destClone};
};

const getList = (id: string): Array<WordObject> => (id === 'droppable-1' ? words : sentence); //eslint-disable-line

const onDragEnd = (result: any) => {
    // dropped outside the list
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      if (destination.droppableId === 'droppable-2') {
        setSentence(reorder(sentence, source.index, destination.index ))
        setTimeout (() => {
          setSentence(sentence.sort((a, b) => a.order > b.order ? 1 : -1))
        }, 500)
      }
    } else {
      const result = move(
          getList(source.droppableId),
          getList(destination.droppableId),
          source,
          destination
      );
      if (source.droppableId === 'droppable-1') {
        setSentence(result.destClone)
        setWords(result.sourceClone)
      } else {
        setSentence(result.sourceClone)
        setWords(result.destClone)
      }
    }
}
  return (
    <TrackWrapper>
      <DragDropContext onDragEnd={onDragEnd}>
      
          <Droppable droppableId={'droppable-1'} direction="horizontal" key={'droppable-1'}>
            {(provided, snapshot) => (
              <TrackMainLine
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {words.map((item, index) => (
                  <Draggable key={`word-${index}`} draggableId={`word-${index}`} index={index}>
                    {(provided, snapshot) => (
                      <SentenceTrackItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {item.item}
                      </SentenceTrackItem>
                    )}
                  </Draggable>
                ))}
              </TrackMainLine>
            )}
          </Droppable>
          <Droppable droppableId={'droppable-2'} direction="horizontal" key={'droppable-2'}>
            {(provided) => (
              <TrackLine
                ref={provided.innerRef}
                {...provided.droppableProps}
              >

                {" "}
                <FlipMove
                  typeName={null}
                  >
                {sentence.map((item, index) => (
                  <Draggable key={`sentence-${index}`} draggableId={`sentence-${index}`} index={index}>
                    {(provided) => (
                      <SentenceTrackItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {item.item}
                      </SentenceTrackItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                </FlipMove>
              </TrackLine>
            )}
          </Droppable>
      </DragDropContext>
      { error === true && (
        <Error>Something wrong!</Error>
      )}
      
      <CheckButton onClick={checkTranslate}>Check</CheckButton>
    </TrackWrapper>
  )
}
