import styled from 'styled-components/native';
import { WebView } from 'react-native-webview';
import { ActivityIndicator } from 'react-native';

export const Browser = styled(WebView)`
  flex: 1;
`;

export const Loading = styled(ActivityIndicator).attrs({
  color: '#7159c1',
  size: 'large',
})`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
`;
