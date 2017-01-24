import styled from 'styled-components';

export default styled.div`
  width: '100%',
  height: '100%',
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'center',
  color: ${(props) => props.color}
`;
