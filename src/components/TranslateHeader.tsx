import { FC, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_SENTENCE } from "../query/sentence";
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
`;

const Title = styled.div`
  font-size: 36px;
  line-height: 42px;
  color: #252525;
  width: 100%;
  text-shadow: -2px -4px 3px #FFFFFF, 2px 4px 3px rgba(0, 0, 0, 0.25);
  cursor: default;
`
const Picture = styled.div`
  width: 185px;
  height: 185px;
  margin: 60px 0 0;
  position: relative;
  background: url(/icons/user.svg) 50% 50% no-repeat;
  background-size: contain;
`
const PictureText = styled.div`
  width: 306px;
  min-height: 90px;
  box-sizing: border-box;
  border: 2px solid #252525;
  border-radius: 10px;
  position: absolute;
  left: 100%;
  top: 0;
  padding: 17px;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
`

const PictureTextWord = styled.span`
  padding: 0 0 5px;
  border-bottom: 1px dashed #222222;
  margin-right: 6px;
  margin-bottom: 8px;
  cursor: default;
`

export const TranslateHeader: FC = () => {
const { data, loading, error } = useQuery(GET_SENTENCE)
const [sentence, setSentence] = useState<Array<string>>([]);
  useEffect(() => {
    if (!loading) {
      setSentence(data.sentence.en.split(' '))
    }
  }, [data]);

  return (
    <Wrapper>
      <Title>Translate this sentence</Title>
      <Picture>
        <PictureText>
          { sentence.map((item, i) => (
            <PictureTextWord key={i}>
              { item }
            </PictureTextWord>
          ))
          }
        </PictureText>
     </Picture>
      
    </Wrapper>
  )
}
