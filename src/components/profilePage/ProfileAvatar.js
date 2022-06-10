import React, {useEffect, useState} from 'react';
import { TouchableOpacity, Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

export const ProfileAvatar = ({imageInputHandler, existingAvatarUrl, reRender}) => {
  const [uri, setUri] = useState(undefined);

  useEffect(() => {
      setUri(existingAvatarUrl);
  }, [existingAvatarUrl, reRender])

  const pickPicture = () => {
    ImagePicker.openPicker({
      width: 180,
      height: 180,
      cropperCircleOverlay: true,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      setUri(image.path);
      imageInputHandler(image);
    });
  };

  return (
    <TouchableOpacity onPress={pickPicture} activeOpacity={0.5}>
      {uri ? (
        <Image
          style={{width: 150, height: 150, borderRadius: 75}}
          resizeMode="contain"
          source={{uri}}
        />
      ) : (
        <Image
          style={{width: 150, height: 150, borderRadius: 75}}
          resizeMode="contain"
          source={require('../../assets/profile.png')}
        />
      )}
    </TouchableOpacity>
  );
};
