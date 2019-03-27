import styled from 'styled-components';

export const Main = styled.main`
  height: 100vh;
  background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 50vw;
`;

export const Text = styled.p`
  font-size: 2.5rem;
  color: snow;
`;

export const Button = styled.button`
  height: 3.5vmax;
  border: 2px solid #0099cc;
  border-radius: 15px;
  width: 50%;
  font-size: 2rem;

  &:hover {
    transition: all 0.05s ease-in;
    background: #0099cc;
    color: snow;
    text-decoration: none;
    cursor: pointer;
  }
`;
