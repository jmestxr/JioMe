import React, { useState, useEffect } from "react";
import { Wrapper } from "../components/basic/Wrapper";
import { Text, VStack, Box, IconButton, HStack, Icon, Input, TextArea, ScrollView } from "native-base";
import Avatar from "../components/basic/Avatar";
import UploadButton from "../components/auth/UploadButton";
import { supabase } from "../../supabaseClient";
import { decode } from 'base64-arraybuffer'
import { findLastValidBreakpoint, stylingProps } from "native-base/lib/typescript/theme/tools";
import { ImageBackground, Image } from "react-native";
import { MaterialIcons } from "@native-base/icons";
import AuthTextInput from "../components/auth/AuthTextInput";
import { color } from "native-base/lib/typescript/theme/styled-system";
import { withSafeAreaInsets } from "react-native-safe-area-context";
import { Warning } from "../components/basic/Warning";
import { useAuth } from '../components/contexts/Auth';
import AuthButton from "../components/auth/AuthButton";
import { useNavigation, StackActions } from '@react-navigation/native';

// import { useRef } from "react";


export const UserProfile = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatar, setAvatar] = useState("")
  const [username, setUsername] = useState("")
  const [website, setWebsite] = useState("")
  const [profileDescription, setProfileDescription] = useState("")
  const [newProfDesc, setNewProfDesc] = useState("")
  const [editing, setEditing] = useState(false)
  // let editing = false;
  const navigation = useNavigation();

  useEffect(() => {
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
    setAvatar(profile.avatar_url)
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

    try {
      setLoading(true)
      const pushAction = StackActions.push('SignIn');
      navigation.dispatch(pushAction)
      const { error } = await supabase.auth.signOut()
      if (error) {
        alert('Error signing out')
      } else {

      }
      // setUploading(false)
      // setAvatar("")
      // setUsername("")
      // setWebsite("")
      // setProfileDescription("")
      // setNewProfDesc("")
      // setEditing(false)

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)

    }
  }
  return (
    <Wrapper>
      <VStack space={4} alignItems='center'>
        {checkAvatar()}
        <UploadButton onUpload={uploadAvatar} height={300} width={300}/>
        <Text fontSize='3xl' alignItems='center' bold={true}>
          {username}
        </Text>
        <HStack alignItems='center'>
          {/* Invisible icon */}
          <Icon size="5xl" _icon={{

          }} ></Icon>
          <Text fontSize='xl' alignItems='center'>
            Description
          </Text>
          {checkButtonIcon()}
        </HStack>
        {checkDescriptionBox()}
        {checkCharacters()}
        <Text fontSize='xl' alignItems='center'>
          Past Events Joined
        </Text>
        {checkPastEvents()}
        <AuthButton onPressHandler={handleSignOut} title='Sign Out' isDisabled={loading} />
      </VStack>
    </Wrapper>
  )
}