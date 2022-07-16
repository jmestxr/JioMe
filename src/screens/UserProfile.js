import React, {useState, useEffect} from 'react';
import {
  Avatar,
  Center,
  Text,
  Icon,
  HStack,
  VStack,
  View,
  TextArea,
} from 'native-base';
import {MaterialIcons, Ionicons} from '@native-base/icons';
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
import {getLocalDateTimeNow, getPublicURL} from '../functions/helpers';
import {HeaderButton} from '../components/basic/HeaderButton';
import {LoadingPage} from '../components/basic/LoadingPage';

import Toast from 'react-native-toast-message';
import EventPage from './EventPage';

const UserProfile = ({route}) => {
  const {user} = useAuth(); // the current logged-in user
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  // Get signOut function from the auth context
  const {signOut} = useAuth();

  const {userId, showBackButton} = route.params; // userId: the unique id of this user

  const [loadingPage, setLoadingPage] = useState(false);
  const [reRender, setReRender] = useState(1); // to rerender to display latest uploaded avatar (not the correct way to do so though)

  const [editing, setEditing] = useState(false);

  const [profileDetails, setProfileDetails] = useState({
    username: '',
    email: '',
    phone: '',
    avatar_url: '', // avatar private url
    profile_description: '',
  });
  const [pastEventsDetails, setPastEventsDetails] = useState([]);

  const [loadingSignOut, setLoadingSignOut] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setLoadingPage(true);
      getProfileDetails().then(() => getPastEventsDetails());
    } else {
      setLoadingPage(true);
    }
  }, [reRender, isFocused]);

  const setProfileDetail = (detail, value) => {
    setProfileDetails(prevState => ({
      ...prevState,
      [detail]: value,
    }));
  };

  const getProfileDetails = async e => {
    try {
      // setLoading(true)

      let {data, error} = await supabase
        .from('profiles')
        .select('username, email, phone, avatar_url, profile_description')
        .eq('id', userId)
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
        id: userId,
        avatar_url: filePath,
      });

      if (updateError) throw updateError;
    } catch (error) {
      setReRender(reRender * -1); // to render the existing avatar again
      console.log(error.message);
      Toast.show({
        type: 'error',
        text1:
          'Error encountered in uploading profile picture. Please upload the image again or try again later.',
      });
    } finally {
      //   setUploading(false)
    }
  };

  // sort past events by to_datetime (earliest first)
  const sortPastEvents = pastEventsArr => {
    return pastEventsArr.sort(function (a, b) {
      const keyA = new Date(a.to_datetime);
      const keyB = new Date(b.to_datetime);
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
  };

  const getPastEventsDetails = async () => {
    Promise.all([
      getPastEventsParticipatedDetails(),
      getPastEventsOrganisedDetails(),
    ])
      .then(results => {
        // sort by last_chat_message created_at time (latest first)
        setPastEventsDetails(sortPastEvents(results[0].concat(results[1])));
      })
      .then(() => setLoadingPage(false));
  };

  const getPastEventsParticipatedDetails = async e => {
    try {
      const {data, error} = await supabase
        .from('events')
        .select('*, user_joinedevents!inner(*)')
        .eq('user_joinedevents.user_id', userId)
        .lt('to_datetime', getLocalDateTimeNow());
      if (error) throw error;
      if (data) return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getPastEventsOrganisedDetails = async e => {
    try {
      const {data, error} = await supabase
        .from('events')
        .select('*')
        .eq('organiser_id', userId)
        .lt('to_datetime', getLocalDateTimeNow());
      if (error) throw error;
      if (data) return data;
    } catch (error) {
      console.log(error);
    }
  };

  const editDescriptionHandler = async () => {
    if (editing) {
      updateDescription();
    } else {
      setEditing(true);
    }
  };

  const updateDescription = async e => {
    try {
      const {data, error} = await supabase.from('profiles').upsert({
        id: user?.id,
        profile_description: profileDetails.profile_description,
      });
      if (error) throw error;
      if (data) {
        setEditing(false);
        Toast.show({
          type: 'success',
          text1: 'Your profile description is updated.',
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1:
          'We have encountered an error updating your profile description. Please try again later.',
      });
    }
  };

  const handleSignOut = async e => {
    // e.preventDefault()
    try {
      setLoadingSignOut(true);

      // Calls `signIn` function from the context
      const {error} = await signOut();

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
      Toast.show({
        type: 'error',
        text1: 'Error encountered in signing out. Please try again later.',
      });
    } finally {
      setLoadingSignOut(false);
    }
  };

  return loadingPage ? (
    <LoadingPage />
  ) : (
    <Wrapper contentViewStyle={{width: '100%'}} statusBarColor="#a1a1aa">
      <Background fromColor="#a1a1aa" toColor="#f2f2f2">
        {showBackButton ? (
          <HeaderButton
            onPressHandler={() => navigation.goBack()}
            xShift={12}
            icon={<Icon as={Ionicons} name="chevron-back" color="white" />}
          />
        ) : null}

        <HeaderButton
          onPressHandler={editDescriptionHandler}
          xShift={350}
          icon={<Icon as={MaterialIcons} name={editing ? "done" : "edit"} color="gray.600" />}
        />

        <Center paddingTop="15%">
          <ProfileAvatar
            imageInputHandler={handleUploadAvatar}
            existingAvatarUrl={
              getPublicURL(profileDetails.avatar_url, 'avatars').uri
            }
            imageSize={150}
            reRender={reRender}
          />

          <Text marginTop="2%" fontSize="2xl">
            {profileDetails.username}
          </Text>

          {editing ? (
            <TextArea
              size="md"
              h={20}
              maxWidth="60%"
              placeholder="Write something about yourself."
              bgColor="gray.200"
              borderColor="gray.300"
              _focus={{borderColor: 'gray.300'}}
              selectionColor="orange.500"
              value={profileDetails.profile_description}
              onChangeText={text => setProfileDetail("profile_description", text)}
            />
          ) : (
            <Text color="gray.600" maxWidth="50%" italic>
              {'"' + profileDetails.profile_description + '"'}
            </Text>
          )}

          <View flexDirection="row" marginTop="5%">
            <HStack justifyContent="space-evenly">
              <EssentialDetail
                width="45%"
                iconName="mail-outline"
                iconColor="gray.800">
                <Text textAlign="center">{profileDetails.email}</Text>
              </EssentialDetail>

              <EssentialDetail
                width="45%"
                iconName="call-outline"
                iconColor="gray.800">
                <Text textAlign="center">+65 {profileDetails.phone}</Text>
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
              (userId == user?.id
                ? 'You have'
                : profileDetails.username + ' has') +
              ' ' +
              'not completed any events.' +
              (userId == user?.id ? '\n' + 'Join one now!' : '')
            }
          />
        ) : (
          <HStack flexWrap="wrap" padding="1%" paddingTop="0%">
            {pastEventsDetails.map((detail, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.5}
                  style={{padding: '1%'}}
                  onPress={() =>
                    navigation.navigate('PastEventPage', {
                      screen: 'EventPage',
                      params: {eventId: detail.id},
                    })
                  }>
                  <Avatar
                    source={getPublicURL(detail.picture_url, 'eventpics')}
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
          isDisabled={loadingSignOut}
        />
      </Center>
    </Wrapper>
  );
};

export default UserProfile;
