import React, {useState, useCallback} from 'react';
import {Text, View, Icon} from 'native-base';
import {MaterialIcons, Ionicons} from '@native-base/icons';
import {TouchableOpacity} from 'react-native';


// Adapted from: https://stackoverflow.com/questions/55805233/how-to-show-for-text-more-less-in-react-naitve-javascript

export const TextCollapsible = ({longText}) => {
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(e => {
    setLengthMore(e.nativeEvent.lines.length > 4); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);

  const showCollapsible = () => {
    if (lengthMore && textShown) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={{position: 'absolute', left: 340, top: -43}}
          onPress={toggleNumberOfLines}>
          <Icon
            as={MaterialIcons}
            name="expand-less"
            color="gray.400"
            size="lg"
          />
        </TouchableOpacity>
      );
    } else if (lengthMore && !textShown) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={{position: 'absolute', left: 340, top: -43}}
          onPress={toggleNumberOfLines}>
          <Icon
            as={MaterialIcons}
            name="expand-more"
            color="gray.400"
            size="lg"
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View>
      <TouchableOpacity activeOpacity={1} onPress={toggleNumberOfLines}>
        <Text
          onTextLayout={onTextLayout}
          numberOfLines={textShown ? undefined : 4}>
          {longText}
        </Text>

        {showCollapsible()}
      </TouchableOpacity>
    </View>
  );
};
