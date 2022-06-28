import React from 'react';
import {IconButton} from 'native-base';

export const HeaderButton = props => {
  const {onPressHandler, xShift, yShift=5, icon, showBgColor=true} = props;

  return (
    <IconButton
      position='absolute'
      style={{transform: [{translateX: xShift}, {translateY: yShift}]}}
      bgColor={showBgColor ? "gray.300:alpha.50" : 'transparent'}
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
