import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { View, VStack, Avatar, Text, HStack } from 'native-base';
import { getPublicURL } from '../../functions/helpers';
import { PROFILE_DEFAULT_IMAGE } from '../../constants/constants';

export const CommentCollapsible = props => {
    const { comments, replies } = props;
    const [commentList, setCommentList] = useState([]);

    useEffect(() => {
        setCommentList(comments);
    }, [comments]);

    /* function returns all <Avatar> from startIndex (inclusive) to endIndex (exclusive) of
          list of avatar private URLs (given in avatarUrlList) */
    //   const renderAvatars = (startIndex, endIndex) => {
    //     return avatarUrlList.slice(startIndex, endIndex).map((data, index) => {
    //       const avatar_publicURL = getPublicURL(data.avatar_url, 'avatars');

    //       return (
    //         <Avatar>
    //           <TouchableOpacity
    //             activeOpacity={0.5}
    //             onPress={() => alert(data.username)}>
    //             <Avatar
    //               key={index}
    //               bg={avatar_publicURL.uri ? "orange.500" : '#f2f2f2'}
    //               source={avatar_publicURL.uri ? avatar_publicURL : {uri: PROFILE_DEFAULT_IMAGE}}></Avatar>
    //           </TouchableOpacity>
    //         </Avatar>
    //       );
    //     });
    //   };

    return (
        <View alignItems="flex-start">
            {commentList.length > 0 ? (
                <VStack alignItems="flex-start">
                    {/* Render comments */}
                    <VStack space={2}>
                        {commentList.map(x => {
                            const avatar_publicURL = getPublicURL(x.profiles.avatar_url, 'avatars');
                            const timeNow = new Date();
                            const timeThen = new Date(x.created_at);
                            const diffInMinutes = Math.floor((timeNow - timeThen) / 60000);
                            const diffInHours = Math.floor(diffInMinutes / 60);
                            const diffInDays = Math.floor(diffInHours / 24);
                            const diffInYears = Math.floor(diffInDays / 365);
                            return (
                                <HStack space={4}>
                                    <VStack space={0}>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => alert(x.profiles.username)}>
                                        <Avatar
                                            // key={index}
                                            size={"sm"}
                                            bg={avatar_publicURL.uri ? "orange.500" : '#f2f2f2'}
                                            source={avatar_publicURL.uri ? avatar_publicURL : { uri: PROFILE_DEFAULT_IMAGE }}>
                                            </Avatar>
                                    </TouchableOpacity>
                                    <Text>
                                        {x.profiles.username}
                                    </Text>
                                    <Text>
                                        {diffInMinutes < 60 ? diffInMinutes == 1 ? "1 minute ago" : diffInMinutes + " minutes ago" :
                                         diffInHours < 24 ? diffInHours == 1 ? "1 hour ago" : diffInHours + " hours ago" :
                                         diffInDays < 364 ? diffInDays == 1 ? "1 day ago" : diffInDays + " days ago" :
                                         diffInYears == 1 ? "1 year ago" : diffInYears + " years ago"}
                                    </Text>
                                    </VStack>
                                    <Text>
                                        {x.comment}
                                    </Text>
                                </HStack>)

                        })}
                    </VStack>
                </VStack>
            ) : null}
        </View>
    );
};
