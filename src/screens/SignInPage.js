import React, { useState } from 'react';
import { Image } from 'react-native';
import { Center, VStack, Text } from 'native-base';
import AuthButton from '../components/auth/AuthButton';
import AuthTextInput from '../components/auth/AuthTextInput';
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
        alert('error signing in')
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
        <Center>
            <Center height='80%' width='80%'>
                <Image 
                    style={{width: 200, height: 200}}
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

                <AuthButton
                    onPressHandler={handleSignIn}
                    title='Sign In'
                    />

                <Text style={{marginTop:'10%'}} fontSize='sm'>
                    New user? &nbsp;
                    <Text underline color='orange.500' onPress={() => navigation.navigate('SignUp')}>          
                    Sign up now!
                    </Text>
                </Text>
            </Center>
        </Center>        
    )
};

export default SignInPage;