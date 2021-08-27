import React, { FC, useState, useEffect } from "react";
import { Translate } from "./components/Translate";
import styled from 'styled-components';
const Container = styled.div`
  display: flex;
  width: 480px;
  margin: 0 auto;
  padding: 30px 0;
  flex-wrap: wrap;
`
const AppWrapper = styled.div`
  display: flex;
  font-family: Roboto, sans-serif;
  align-items: center;
  background: #e5e5e5;

`
const App: FC = () => {
  return (
			<AppWrapper>
        <Container>
          <Translate />
        </Container>
			</AppWrapper>
  );
};

export default App;