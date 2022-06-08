import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {View, Text, Icon, PresenceTransition} from 'native-base';
import {MaterialIcons} from '@native-base/icons';

export const CardIcon = ({iconLabel, iconName, shiftX, onPressHandler}) => {
  const [showLabel, setShowLabel] = useState(false);

  return (
    <View alignItems="center" justifyContent="center">
      <PresenceTransition
        visible={showLabel}
        initial={{opacity: 0}}
        animate={{
          opacity: 1,
          transition: {
            duration: 150,
          },
        }}>
        <Text
          fontSize="xs"
          fontWeight="semibold"
          position="absolute"
          style={{transform: [{translateX: shiftX}, {translateY: -20}]}}>
          {iconLabel}
        </Text>
      </PresenceTransition>

      <TouchableOpacity
        activeOpacity={0.5}
        onPress={onPressHandler}
        delayLongPress={200}
        onLongPress={() => setShowLabel(true)}
        onPressOut={() => setShowLabel(false)}>
        <Icon
          as={MaterialIcons}
          name={iconName}
          color="orange.600:alpha.70"
          size="5xl"
        />
      </TouchableOpacity>
    </View>
  );
};
