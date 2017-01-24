import styled from 'styled-components';

export default styled.div`
  width: '100%',
  height: '100%',
  display: 'flex',
  flexFlow: 'row wrap',
  color: ${(props) => props.color}
`;
