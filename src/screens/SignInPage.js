import React, { useState } from 'react';
import { Image } from 'react-native';
import { Center, VStack, Text } from 'native-base';
import CustomButton from '../components/basic/CustomButton';
import AuthTextInput from '../components/auth/AuthTextInput';
import { FocusAwareStatusBar } from '../components/basic/FocusAwareStatusBar';
import { useNavigation, StackActions } from '@react-navigation/native';
import { useAuth } from '../components/contexts/Auth';

const SignInPage = () => {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation(); 

    // Get signIn function from the auth context
    const { signIn } = useAuth()

    const handleSignIn = async (e) => {
      e.preventDefault()

      setLoading(true)

      // Calls `signIn` function from the context
      const { error } = await signIn({ email, password })

      if (error) {
        alert('Error: Invalid email or password.')
      } else {
        setEmail('')
        setPassword('')
        // Redirect user to Dashboard
        const pushAction = StackActions.push('Dashboard');
        navigation.dispatch(pushAction);
      }

      setLoading(false)
    }
    
        
    return (
        <Center height='100%' width='100%'>
                <FocusAwareStatusBar barStyle="dark-content" backgroundColor='#f2f2f2' />
                <Image 
                    style={{width: 225, height: 225, marginBottom:'0%'}}
                    source={require('../assets/logo.png')} 
                />

                <VStack space={4} alignItems="center">
                    <AuthTextInput
                        placeholder='Email'
                        value={email}
                        secureTextEntry={false}
                        textHandler={setEmail}
                        iconName='mail-outline'
                        />
                    <AuthTextInput
                        placeholder='Password'
                        value={password}
                        secureTextEntry={true}
                        textHandler={setPassword}
                        iconName='lock-outline'
                        />
                </VStack>


                <CustomButton 
                    title='Sign In'
                    width='25%' 
                    color='#f97316'// orange.500
                    onPressHandler={handleSignIn} 
                    isDisabled={loading}
                />

                <Text style={{marginTop:'10%'}} fontSize='sm'>
                    New user? &nbsp;
                    <Text underline color='orange.500' onPress={() => navigation.navigate('SignUp')}>          
                    Sign up now!
                    </Text>
                </Text>
        </Center>        
    )
};

export default SignInPage;