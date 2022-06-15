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
import {getLocalDateTimeNow, getPublicURL} from '../functions/helpers';
import {HeaderButton} from '../components/basic/HeaderButton';

const UserProfile = () => {
  const {user} = useAuth();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  // Get signOut function from the auth context
  const { signOut } = useAuth()

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
{/** 
// let flag = true;
    getProfile()
  })

  const getProfile = async (e) => {
      try {
        // setLoading(true)

        let { data, error } = await supabase
          .from('profiles')
          .select(`username, website, avatar_url, profile_description`)
          .eq('id', user.id)
          .single()

        if (error) {
          console.log(error)
          // throw error
        }
        setProfile(data)
      } catch (error) {
        console.log('error', error.message)
      } finally {
        // setLoading(false)
      }
    }
  

  function setProfile(profile) {
    const { publicURL, error } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(profile.avatar_url)
    console.log('public url is', publicURL)

    setAvatar(publicURL)
    setUsername(profile.username)
    setWebsite(profile.website)
    setProfileDescription(profile.profile_description)
  }

  const uploadAvatar = async (event) => {
      try {
        setUploading(true)

        const base64FileData = event.data

        const filePath = event.path;

        let { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, decode(base64FileData))

        if (uploadError) {
          console.log(uploadError)
          // throw uploadError
        }

        let { error: updateError } = await supabase.from('profiles').upsert({
          id: user.id,
          avatar_url: filePath,
        })

        if (updateError) {
          console.log(updateError)
          // throw updateError
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setUploading(false)
      }
    }
  

  // function checks whether to put the default avatar or given one
  function checkAvatar() {
    if (avatar == null || avatar == "") {
      return <Avatar source={require('../assets/profile.png')} size={200} />
      return <Image
        style={{ width: 200, height: 200 }}
        resizeMode={"contain"}
        borderRadius={100}
        source={require('../assets/profile.png')}
      />
    } else {
      return <Avatar source={{ uri: avatar }} size={200} />
      return <Image
        source={{
          uri: avatar
        }}
        style={{ height: 200, width: 200 }}
        resizeMode={"contain"}
        borderRadius={100}
      />
    }
  }

  // function checks whether to display the edit or save icon
  function checkButtonIcon() {
    if (editing) {
      return <IconButton onPress={submitDescription} size="lg" _icon={{
        as: MaterialIcons,
        name: "save",
        color: "#e8ab8b"
      }} ></IconButton>
    } else {
      return <IconButton onPress={switchEditingState} size="lg" _icon={{
        as: MaterialIcons,
        name: "edit",
        color: "#e8ab8b"
      }} ></IconButton>
    }
  }

  function switchEditingState() {
    setNewProfDesc(profileDescription)
    setEditing(!editing);
  }

  const submitDescription = async (e) => {
    e.preventDefault()
      if (newProfDesc.length > 200) {
        alert('Your description is too long.')
      } else {
        const user = supabase.auth.user();
        try {
          setUploading(true)
          let { error: updateError } = await supabase.from('profiles').upsert({
            id: user.id,
            profile_description: newProfDesc,
          })
          switchEditingState()
          if (updateError) {
            console.log(updateError)
            // throw updateError
          }
        } catch (error) {
          alert(error.message)
        } finally {
          setUploading(false)
        }
      }
    }
  

  // function checks whether to display an editable description box
  function checkDescriptionBox() {
    // console.log('check desc')
    if (editing) {
      return <ScrollView><Box borderColor="#ea580c" borderWidth={7} width={300} height="150" bg="#e8ab8b" _text={{
        fontSize: "md",
        fontWeight: "medium",
        letterSpacing: "lg"
      }}
      >
        <TextArea
          borderColor="#e8ab8b"
          size='md'
          h="full"
          placeholder="Enter a New Description"
          placeholderTextColor="black"
          defaultValue={newProfDesc}
          value={newProfDesc}
          onChangeText={setNewProfDesc}
          _text={{
            fontSize: "md",
            fontWeight: "medium",
            letterSpacing: "lg",
          }}
        />
      </Box>
      </ScrollView>
    } else {
      return <ScrollView><Box borderColor="#e8ab8b" borderWidth={7} width={300} height={150} bg="#e8ab8b" _text={{
        fontSize: "md",
        fontWeight: "medium",
        letterSpacing: "lg"
      }}>
        <ScrollView>
          <Text>
            {profileDescription}
          </Text>
        </ScrollView>
      </Box>
      </ScrollView>
    }
  }

  // function checks how many characters they can input
  function checkCharacters() {
    if (editing) {
      let remaining = 200 - newProfDesc.length;
      return <Warning warningMessage={remaining < 0 ? "Description is too long" : remaining + " characters remaining."} />
    }
  }

  // function arranges the past events
  function checkPastEvents() {
    return <ScrollView><Box borderColor="#e8ab8b" borderWidth={7} width={300} height={150} bg="#e8ab8b" _text={{
      fontSize: "md",
      fontWeight: "medium",
      letterSpacing: "lg"
    }}>
    </Box>
    </ScrollView>
  }

  const handleSignOut = async (e) => {
    // e.preventDefault()
  */} 

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
      setPastEventsDetails([])
      
      let {data: participatedData, error: participatedError} = await supabase
        .from('events')
        .select('*, user_joinedevents!inner(*)')
        .eq('user_joinedevents.user_id', user.id)
        .lt('to_datetime', getLocalDateTimeNow());

      if (participatedError) throw participatedError;
      if (participatedData) {
        setPastEventsDetails(prevArr => [
          ...prevArr,
          ...Object.values(participatedData),
        ]);
      }

      let {data: organisedData, error: organisedError} = await supabase
        .from('events')
        .select('*')
        .eq('organiser_id', user.id)
        .lt('to_datetime', getLocalDateTimeNow());
      if (organisedError) throw organisedError;
      if (organisedData) {
        setPastEventsDetails(prevArr => [
          ...prevArr,
          ...Object.values(organisedData),
        ]);
      }
    } catch (error) {
      console.log(error.error_description || error.message);
    }
  };

  const handleSignOut = async e => {
    // e.preventDefault()
    try {
      // setLoading(true)


      // Calls `signIn` function from the context
      const { error } = await signOut()

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
        <HeaderButton
          onPressHandler={() => alert('Edit description?')}
          xShift={350}
          icon={<Icon as={MaterialIcons} name="edit" color="gray.600" />}
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
                <Text textAlign="center">(Your email here)</Text>
              </EssentialDetail>

              <EssentialDetail
                width="45%"
                iconName="call-outline"
                iconColor="gray.800">
                <Text textAlign="center">+65 (Your phone no here)</Text>
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
          // isDisabled={loading}
        />
      </Center>
    </Wrapper>
  );
};

export default UserProfile;
