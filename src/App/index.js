import React from 'react';
import ReactDOM from 'react-dom';
import Board from '../Board';
import styled from 'styled-components';

const StyledApp = styled.main`
display: flex;
flex-direction: row;
flex-wrap: wrap;
padding: 3em;
justify-content: space-around;

  & > div:not(:last-child) {
    margin-bottom: 2em;
  }
`

function App() {
    return ( 
        <StyledApp>
        <Board />
        </StyledApp>
    );
}

export default App;
