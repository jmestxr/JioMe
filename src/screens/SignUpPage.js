import React, {useState} from 'react';
import {Image} from 'react-native';
import {Center, VStack, Text} from 'native-base';
import {Ionicons} from '@native-base/icons';
import {Warning} from '../components/basic/Warning';
import CustomButton from '../components/basic/CustomButton';
import AuthTextInput from '../components/auth/AuthTextInput';
import {FocusAwareStatusBar} from '../components/basic/FocusAwareStatusBar';
import {useNavigation, StackActions} from '@react-navigation/native';
import {useAuth} from '../components/contexts/Auth';
import {supabase} from '../../supabaseClient';

import Toast from 'react-native-toast-message';

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  const navigation = useNavigation();

  // Get signUp function from the auth context
  const {signUp, signIn} = useAuth();

  const createUserProfile = async e => {
    try {
      const user = supabase.auth.user();
      const {data, error} = await supabase
        .from('profiles')
        .insert([{id: user.id, username: username, email: email, phone: phoneNumber}]);
      // Clear fields
      setUsername('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setConfirmPassword('');

      setLoading(false);

      // Redirect user to Dashboard
      // Should there be a confirmation page to await confirmation of email?
      const pushAction = StackActions.push('SignIn');
      navigation.dispatch(pushAction);
      Toast.show({
        type: 'success',
        text1: 'Account created! Please proceed to login.',
      });
      if (error) throw error;
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error encountered in creating account. Please try again later.',
      });
    }
  };

  const handleLogin = async e => {
    try {
      // e.preventDefault()
      const {error} = await signIn({email, password});
      if (error) {
        throw error;
      } else {
        createUserProfile();
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error encountered in logging in. Please try again later.',
      });
    }
  };

  const handleSignUp = async e => {
    e.preventDefault();

    setLoading(true);

    // checks the Usernames table whether username is in use
    const {data, count} = await supabase
      .from('profiles')
      .select('*', {count: 'exact'})
      .eq('username', username);

    if (username.length == 0) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a username.',
      });
    } else if (phoneNumber.length == 0) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a phone number.',
      });
    } else if (phoneNumber.length != 9) {
      Toast.show({
        type: 'error',
        text1: 'Phone number entered is invalid.',
      });
    } else if (password.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Your password should have at least 8 characters.',
      });
    } else if (password != confirmpassword) {
      Toast.show({
        type: 'error',
        text1: 'Your passwords do not match.',
      });
    } else if (count > 0) {
      // username taken
      Toast.show({
        type: 'error',
        text1:
          'Username has already been taken. Please enter a different username.',
      });
    } else {
      const {error} = await signUp({
        email: email,
        password: password,
      });
      if (error) {
        Toast.show({
          type: 'error',
          text1: 'An account already exists with this email.',
        });
      } else {
        // Sign up is successful; proceeds to call signIn function to insert user details into profiles table
        handleLogin();
      }
    }
    setLoading(false);
  };

  // function displays warning message if password is invalid
  function checkPassword() {
    if (password.length > 0 && password.length < 8) {
      return (
        <Warning warningMessage="Password does not meet the requirements." />
      );
    }
  }

  // function displays warning message if passwords do not match
  function checkConfirmPassword() {
    if (confirmpassword.length > 0 && confirmpassword != password) {
      return <Warning warningMessage="Passwords are not the same." />;
    }
  }

  // function displays warning message if phone number is invalid
  function checkPhoneNumber() {
    if (phoneNumber.length > 0 && phoneNumber.length != 9) {
      return <Warning warningMessage="Invalid phone number." />;
    }
  }

  const handlePhoneNumber = text => {
    let formattedText = text.split(' ').join('');
    if (formattedText.length > 0) {
      formattedText = formattedText.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
    setPhoneNumber(formattedText);
  };

  return (
    <Center height="100%" width="100%">
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#f2f2f2" />
      <Image
        style={{width: 225, height: 225}}
        source={require('../assets/logo.png')}
      />
      <VStack space={4} alignItems="center">
        <AuthTextInput
          placeholder="Username"
          value={username}
          textHandler={setUsername}
          iconName="badge"
        />
        <AuthTextInput
          placeholder="Email"
          value={email}
          textHandler={setEmail}
          iconName="mail-outline"
        />
        <AuthTextInput
          placeholder="Phone Number"
          value={phoneNumber}
          textHandler={handlePhoneNumber}
          keyboardType="numeric"
          iconLibrary={Ionicons}
          iconName="call-outline"
          textInFront={true}
        />
        {checkPhoneNumber()}
        <AuthTextInput
          placeholder="Password (At least 8 characters)"
          value={password}
          secureTextEntry={true}
          textHandler={setPassword}
          iconName="lock-outline"
        />
        {checkPassword()}
        <AuthTextInput
          placeholder="Confirm Password"
          value={confirmpassword}
          secureTextEntry={true}
          textHandler={setConfirmPassword}
          iconName="lock-outline"
        />
        {checkConfirmPassword()}
      </VStack>
      <CustomButton
        title="Sign Up"
        width="25%"
        color="#f97316" // orange.500
        onPressHandler={handleSignUp}
        isDisabled={loading}
      />
      <Text style={{marginTop: '10%'}} fontSize="sm">
        Existing user? &nbsp;
        <Text
          underline
          color="orange.500"
          onPress={() => navigation.navigate('SignIn')}>
          Sign in now!
        </Text>
      </Text>
    </Center>
  );
};

export default SignUpPage;
