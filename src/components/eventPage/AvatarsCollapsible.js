import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {View, VStack, Avatar} from 'native-base';
import {supabase} from '../../../supabaseClient';

export const AvatarsCollapsible = props => {
  const {avatarUrls} = props;
  const [avatarUrlList, setAvatarUrlList] = useState([]);

  useEffect(() => {
    setAvatarUrlList(avatarUrls);
  }, [avatarUrls]);

  /* function returns all <Avatar> from startIndex (inclusive) to endIndex (exclusive) of
        list of avatar private URLs (given in avatarUrlList) */
  const renderAvatars = (startIndex, endIndex) => {
    return avatarUrlList.slice(startIndex, endIndex).map((data, index) => {
      const {publicURL, error} = supabase.storage
        .from('avatars')
        .getPublicUrl(data.avatar_url);

      return (
        <Avatar>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => alert(data.username)}>
            <Avatar
              key={index}
              bg="orange.500"
              source={{uri: publicURL}}></Avatar>
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
