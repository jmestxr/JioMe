import React, {useState} from 'react';
import {Dimensions, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Center, Text} from 'native-base';
import {Ionicons} from '@native-base/icons';
import ImagePicker from 'react-native-image-crop-picker';

const windowHeight = Dimensions.get('window').height;

export const EventPictureInput = ({ imageInputHandler }) => {
  const [uri, setUri] = useState(undefined);

  const pickPicture = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 200,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      console.log('image is ', image)
      setUri(image.path);
      imageInputHandler(image);
    });
  };

  return (
    <TouchableOpacity onPress={pickPicture} activeOpacity={0.8}>
      {uri ? (
        <Center style={styles.frame} bgColor="gray.200:alpha.40">
          <Image
            style={{height:'100%', width:'100%'}}
            source={{uri}}
            resizeMode="contain"
          />
        </Center>
      ) : (
        <Center style={styles.frame} bgColor="gray.200:alpha.40">
          {/* <Icon as={Ionicons} name="cloud-upload" color="gray.300" size={100} /> */}
          <Image
            style={{height: 100, width: 100}}
            source={require('../../assets/upload.png')}
          />
          <Text fontSize="md" color="gray.300">
            Upload an image
          </Text>
        </Center>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    height: windowHeight * 0.3,
    borderRadius: 5,
  },
});
