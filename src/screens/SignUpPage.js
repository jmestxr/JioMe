import React, { useState } from 'react';
import { Image } from 'react-native';
import { Center, VStack, Text } from 'native-base';
import { Warning } from '../components/basic/Warning';
import CustomButton from '../components/basic/CustomButton';
import AuthTextInput from '../components/auth/AuthTextInput';
import { useNavigation, StackActions } from '@react-navigation/native';
import { useAuth } from '../components/contexts/Auth';
import { supabase } from '../../supabaseClient';


const SignUpPage = () => {
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmPassword] = useState('')

    const navigation = useNavigation(); 

    // Get signUp function from the auth context
    const { signUp, signIn } = useAuth()

    const createUserProfile = async (e) => {
     try {
       const user = supabase.auth.user()
       const { data, error } = await supabase
       .from('profiles')
       .insert([
         { id: user.id, username: username },
       ])
       // Clear fields
       setUsername('')
       setEmail('')
       setPassword('')
       setConfirmPassword('')

       setLoading(false)

       // Redirect user to Dashboard
       // Should there be a confirmation page to await confirmation of email?
       const pushAction = StackActions.push('Dashboard');
       navigation.dispatch(pushAction);
       if (error) throw error
     } catch (error) {
       alert(error.error_description || error.message)
     }
   }

    const handleLogin = async (e) => {
     try {
       // e.preventDefault()
       const { error } = await signIn({ email, password })
       if (error) {
         throw error;
       } else {
         createUserProfile()
       }
     } catch (error) {
       alert(error.error_description || error.message)
     } 
   }

    const handleSignUp = async (e) => {
        e.preventDefault()
  
        setLoading(true)

        // checks the Usernames table whether username is in use
        const {data, count} = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .eq('username', username)
        
        if (password.length < 8) {
            alert('Error: Your password should have at least 8 characters.')
        } else if (password != confirmpassword) {
            alert('Error: Your passwords do not match.')
        } else if (count > 0) {
            // username taken
            alert('Error: Username has already been taken. Please try again.')
        } else {
            const { error } = await signUp({ email, password })
            if (error) {
                alert('Error: unable to sign up with the email provided. Please enter a different email.')
            } else {
                // Sign up is successful; proceeds to call signIn function to insert user details into profiles table
                handleLogin()
            }
        }  
        setLoading(false)
    }

    // function displays warning message if password is invalid
    function checkPassword() {
        if (password.length > 0 && password.length < 8) {
            return <Warning warningMessage="Password does not meet the requirements." />
        }
    }

    // function displays warning message if passwords do not match
    function checkConfirmPassword() {
        if (confirmpassword.length > 0 && confirmpassword != password) {
            return <Warning warningMessage="Passwords are not the same." />
        }
    }

    return (
            <Center height='100%' width='100%'>
                <Image 
                    style={{width: 225, height: 225}}
                    source={require('../assets/logo.png')} 
                />
                <VStack space={4} alignItems="center">
                    <AuthTextInput
                        placeholder='Username'
                        value={username}
                        secureTextEntry={false}
                        textHandler={setUsername}
                        iconName='badge'
                        />
                    <AuthTextInput
                        placeholder='Email'
                        value={email}
                        secureTextEntry={false}
                        textHandler={setEmail}
                        iconName='mail-outline'
                        />
                    <AuthTextInput
                        placeholder='Password (At least 8 characters)'
                        value={password}
                        secureTextEntry={true}
                        textHandler={setPassword}
                        iconName='lock-outline'
                        />
                    {checkPassword()}
                    <AuthTextInput 
                        placeholder='Confirm Password'
                        value={confirmpassword}
                        secureTextEntry={true}
                        textHandler={setConfirmPassword}
                        iconName='lock-outline'
                        />
                    {checkConfirmPassword()}
                </VStack>
                <CustomButton 
                    title='Sign Up'
                    width='25%' 
                    color='#f97316'// orange.500
                    onPressHandler={handleSignUp} 
                    isDisabled={loading}
                />
                <Text style={{marginTop:'10%'}} fontSize='sm'>
                    Existing user? &nbsp;
                    <Text underline color='orange.500' onPress={() => navigation.navigate('SignIn')}>          
                    Sign in now!
                    </Text>
                </Text>
            </Center>
    )
}

export default SignUpPage;