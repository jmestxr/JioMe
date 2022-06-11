import React from 'react';
import {Image} from 'react-native';
import {Text, Center} from 'native-base';

export const ZeroEventCard = props => {
  const {imagePath, imageWidth, imageHeight, textMessage} = props;

  return (
    <Center marginTop='3%'>
      <Image style={{width: imageWidth, height: imageHeight, opacity:0.8}} source={imagePath} />
      <Text
        textAlign="center"
        fontSize='md'
        marginTop="5%">
        {textMessage}
      </Text>
    </Center>
  );
};
