import React from 'react';
import {Image} from 'react-native';
import {Center, Text} from 'native-base';
import { FocusAwareStatusBar } from './FocusAwareStatusBar';


export const LoadingPage = () => {
  return (
    <Center width='100%' height='100%'>
      <FocusAwareStatusBar backgroundColor='#ea580c' />
      <Image
        style={{width: 175, height: 175, opacity: 0.8}}
        source={require('../../assets/koala_loading.png')}
      />
      <Text fontSize='md' marginTop='5%'>Loading...</Text>
    </Center>
  );
};
