import React, {useState, useEffect} from 'react';
import {
  Avatar,
  Center,
  Text,
  Icon,
  HStack,
  VStack,
  View,
  IconButton,
} from 'native-base';
import {MaterialIcons} from '@native-base/icons';
import {Wrapper} from '../components/basic/Wrapper';
import Background from '../components/eventPage/Background';
import {ProfileAvatar} from '../components/profilePage/ProfileAvatar';
import {EssentialDetail} from '../components/basic/EssentialDetail';
import {TouchableOpacity} from 'react-native';
import {useAuth} from '../components/contexts/Auth';
import {useIsFocused} from '@react-navigation/native';
import {supabase} from '../../supabaseClient';
import {decode} from 'base64-arraybuffer';
import {ZeroEventCard} from '../components/eventCards/ZeroEventCard';
import CustomButton from '../components/basic/CustomButton';
import {useNavigation, StackActions} from '@react-navigation/native';
import {getEventPicture} from '../functions/eventHelpers';
import { getLocalDateTimeNow } from '../functions/helpers';

const UserProfile = () => {
  const {user} = useAuth();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [reRender, setReRender] = useState(1); // to rerender profile page (not the correct way to do so though)

  const [profileDetails, setProfileDetails] = useState({
    username: '',
    avatar_url: '', // avatar private url
    profile_description: '',
  });
  const [pastEventsDetails, setPastEventsDetails] = useState([]);

  useEffect(() => {
    getProfileDetails();
    getPastEventsDetails();
  }, [reRender, isFocused]);

  const getProfileDetails = async e => {
    try {
      // setLoading(true)

      let {data, error} = await supabase
        .from('profiles')
        .select(`username, avatar_url, profile_description`)
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfileDetails(data);
      }
    } catch (error) {
      console.log('error', error.message);
    } finally {
      // setLoading(false)
    }
  };

  const handleUploadAvatar = async image => {
    try {
      //   setUploading(true)

      const base64FileData = image.data;

      const filePath = image.path;

      let {error: uploadError} = await supabase.storage
        .from('avatars')
        .upload(filePath, decode(base64FileData));

      if (uploadError) throw uploadError;

      let {error: updateError} = await supabase.from('profiles').upsert({
        id: user.id,
        avatar_url: filePath,
      });

      if (updateError) throw updateError;
    } catch (error) {
      setReRender(reRender * -1); // to render the existing avatar again
      console.log(error.message);
      alert('Error in uploading profile picture!');
    } finally {
      //   setUploading(false)
    }
  };

  const getAvatarPrivateUrl = () => {
    try {
      if (profileDetails.avatar_url == '') return '';

      const {publicURL, error} = supabase.storage
        .from('avatars')
        .getPublicUrl(profileDetails.avatar_url);
      if (error) throw error;
      if (publicURL) return publicURL;
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  const getPastEventsDetails = async e => {
    try {
      const {data, error} = await supabase
        .from('events')
        .select('*, user_joinedevents!inner(*)')
        .eq('user_joinedevents.user_id', user.id)
        .lt('to_datetime', getLocalDateTimeNow());

      if (error) throw error;
      if (data) {
        setPastEventsDetails(Object.values(data));
      }
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  const handleSignOut = async e => {
    // e.preventDefault()
    try {
      // setLoading(true)
      const {error} = await supabase.auth.signOut();
      if (error) {
        alert('Error signing out');
      } else {
        const pushAction = StackActions.push('SignIn');
        navigation.dispatch(pushAction);
      }
      // setUploading(false)
      // setAvatar("")
      // setUsername("")
      // setWebsite("")
      // setProfileDescription("")
      // setNewProfDesc("")
      // setEditing(false)
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false)
    }
  };

  return (
    <Wrapper contentViewStyle={{width: '100%'}} statusBarColor="#a1a1aa">
      <Background fromColor="#a1a1aa" toColor="#f2f2f2">
        <IconButton
          position="absolute"
          style={{transform: [{translateX: 350}, {translateY: 5}]}}
          bgColor="gray.300:alpha.50"
          icon={<Icon as={MaterialIcons} name="edit" color="gray.600" />}
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
          onPress={() => alert('Edit description?')}
        />
        <Center paddingTop="15%">
          <ProfileAvatar
            imageInputHandler={handleUploadAvatar}
            existingAvatarUrl={getAvatarPrivateUrl()}
            reRender={reRender}
          />

          <Text marginTop="2%" fontSize="2xl">
            {profileDetails.username}
          </Text>
          <Text color="gray.600" maxWidth="50%" italic>
            {'"' + profileDetails.profile_description + '"'}
          </Text>

          <View flexDirection="row" marginTop="5%">
            <HStack justifyContent="space-evenly">
              <EssentialDetail
                width="45%"
                iconName="mail-outline"
                iconColor="gray.800">
                <Text textAlign="center">tan_xing_rong@hotmail.com</Text>
              </EssentialDetail>

              <EssentialDetail
                width="45%"
                iconName="call-outline"
                iconColor="gray.800">
                <Text textAlign="center">+65 9742 8002</Text>
              </EssentialDetail>
            </HStack>
          </View>
        </Center>
      </Background>

      <VStack space={3} marginTop="10%" padding="5%">
        <Text fontWeight="medium" fontSize="lg">
          Past Events Joined:
        </Text>
        {/* To render past events in avatar form: */}
        {pastEventsDetails.length == 0 ? (
          <ZeroEventCard
            imagePath={require('../assets/koala_baby.png')}
            imageWidth={150}
            imageHeight={150}
            textMessage={
              'You have not completed any events.' + '\n' + 'Join one now!'
            }
          />
        ) : (
          <HStack flexWrap="wrap" padding="1%" paddingTop="0%">
            {pastEventsDetails.map((detail, index) => {
              return (
                <TouchableOpacity 
                  activeOpacity={0.5} 
                  style={{padding: '1%'}} 
                  onPress={() =>
                    navigation.navigate('EventPage', {
                      eventId: detail.id,
                    })
                  }>
                  <Avatar
                    source={getEventPicture(detail.picture_url)}
                    size="lg">
                    PE
                  </Avatar>
                </TouchableOpacity>
              );
            })}
          </HStack>
        )}
      </VStack>

      <Center>
        <CustomButton
          title="Sign Out"
          width="25%"
          color="#f97316" // orange.500
          onPressHandler={handleSignOut}
          // isDisabled={loading}
        />
      </Center>
    </Wrapper>
  );
};

export default UserProfile;
