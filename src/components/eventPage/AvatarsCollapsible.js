import React, {useState, useEffect} from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {View, VStack, Avatar} from 'native-base';
import { getPublicURL } from '../../functions/helpers';
import { PROFILE_DEFAULT_IMAGE } from '../../constants/constants';
import { useNavigation } from '@react-navigation/native';

export const AvatarsCollapsible = props => {
  const {avatarUrls} = props;
  const [avatarUrlList, setAvatarUrlList] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    setAvatarUrlList(avatarUrls);
  }, [avatarUrls]);

  /* function returns all <Avatar> from startIndex (inclusive) to endIndex (exclusive) of
        list of avatar private URLs (given in avatarUrlList) */
  const renderAvatars = (startIndex, endIndex) => {
    return avatarUrlList.slice(startIndex, endIndex).map((data, index) => {
      const avatar_publicURL = getPublicURL(data.avatar_url, 'avatars');

      return (
        <Avatar>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('AvatarProfile', {
              screen:'UserProfile',
              params: {userId: data.id, showBackButton: true}
            })}>
            <Avatar
              key={index}
              bg={avatar_publicURL.uri ? "orange.500" : '#f2f2f2'}
              source={avatar_publicURL.uri ? avatar_publicURL : {uri: PROFILE_DEFAULT_IMAGE}}></Avatar>
          </TouchableOpacity>
        </Avatar>
      );
    });
  };

  return (
    <View alignItems="flex-start">
      {avatarUrlList.length > 0 ? (
        <VStack alignItems="flex-start">
          {/* Render avatars in rows of 11 */}
          {
            // Rendering full rows
            Math.floor(avatarUrlList.length / 11) > 0
              ? Array(Math.floor(avatarUrlList.length / 11))
                  .fill(0)
                  .map((ignore, batchNo) => {
                    return (
                      <Avatar.Group
                        _avatar={{
                          size: 'md',
                          borderColor: '#f2f2f2',
                        }}>
                        {renderAvatars(batchNo * 11, (batchNo + 1) * 11)}
                      </Avatar.Group>
                    );
                  })
              : null
          }
          {
            // Rendering the last row
            avatarUrlList.length - Math.floor(avatarUrlList.length / 11) * 11 >
            0 ? (
              <Avatar.Group
                _avatar={{
                  size: 'md',
                  borderColor: '#f2f2f2',
                }}>
                {renderAvatars(
                  Math.floor(avatarUrlList.length / 11) * 11,
                  avatarUrlList.length,
                )}
              </Avatar.Group>
            ) : null
          }
        </VStack>
      ) : null}
    </View>
  );
};
