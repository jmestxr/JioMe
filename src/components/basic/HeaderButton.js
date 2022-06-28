import React from 'react';
import {IconButton} from 'native-base';

export const HeaderButton = props => {
  const {onPressHandler, xShift, yShift=5, icon, position='absolute'} = props;

  return (
    <IconButton
      position={position}
      style={{transform: [{translateX: xShift}, {translateY: yShift}]}}
      bgColor="gray.300:alpha.50"
      icon={icon}
      borderRadius="full"
      _icon={{
        size: 'xl',
      }}
      _hover={{
        bg: 'gray.300:alpha.20',
      }}
      _pressed={{
        bg: 'gray.300:alpha.20',
      }}
      onPress={onPressHandler}
    />
  );
};
