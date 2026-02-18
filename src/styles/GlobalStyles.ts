import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #0a0a0d;
    color: #ffffff;
  }

  code,
  pre {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      'Liberation Mono', 'Courier New', monospace;
  }

  /* Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #18181b;
  }

  ::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #52525b;
  }

  /* Selection */
  ::selection {
    background-color: #3b82f6;
    color: #ffffff;
  }

  /* Focus visible */
  :focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Remove default button styles */
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  /* Remove default input styles */
  input,
  textarea,
  select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Image defaults */
  img {
    display: block;
    max-width: 100%;
  }
`;
