import React, { useState } from 'react';
import { Image } from 'react-native';
import { Box, Center, VStack, Text, Checkbox, FormControl, Input, WarningOutlineIcon, ScrollView } from 'native-base';
import AuthButton from '../components/auth/AuthButton';
import AuthTextInput from '../components/auth/AuthTextInput';
import { useNavigation, StackActions } from '@react-navigation/native';
import { useAuth } from '../components/contexts/Auth';
// import { FullWindowOverlay } from 'react-native-screens';
import { supabase } from '../../supabaseClient';


const SignUpPage = () => {
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmPassword] = useState('')
    // Do we need this to ask for phone number? May be too complicated
    // const [number, setNumber] = useState('')
    // Checks the ticks of the required checkboxes
    const [checked1, setChecked1] = useState(false)
    const [checked2, setChecked2] = useState(false)

    const navigation = useNavigation(); 

    // Get signIn function from the auth context
    const { signUp } = useAuth()

    const handleSignUp = async (e) => {
        e.preventDefault()
  
        setLoading(true)

        // checks the Usernames table whether username is in use
        const {data, count} = await supabase
            .from('Usernames')
            .select('*', { count: 'exact' })
            .eq('username', username)
        
        if (password.length < 8) {
            alert('Error: Your password should have at least 8 characters.')
        } else if (password != confirmpassword) {
            alert('Error: Your passwords do not match.')
        } else if (!checked1 || !checked2) {
            // checks at least one of the checkboxes not ticked
            alert('Error: You did not check all the required checkboxes')
        } else if (count > 0) {
            // username taken
            alert('Error: Username has already been taken. Please try again')
        } else {
            const { error } = await signUp({ email, password })
            if (error) {
                alert('Error: unable to sign up with the email provided. Please enter a different Email')
            } else {
                // insert details into Username table
                const { testingdata, testingerror } = await supabase
                    .from('Usernames')
                    .insert([
                        {username: username},
                    ])

                // To be modified in future?
                setEmail('')
                setPassword('')

                // Redirect user to Dashboard
                // Should there be a confirmation page to await confirmation of email?
                const pushAction = StackActions.push('Dashboard');
                navigation.dispatch(pushAction);
            }
        }  
        setLoading(false)
    }

    // function displays warning message if password is invalid
    function checkPassword() {
        if (password.length > 0 && password.length < 8) {
            return (
                <Text fontSize='sm' color={"#f87171"} >
                    *Password Does not meet the requirements.
                </Text>
            )
        }
    }

    // function displays warning message if passwords do not match
    function checkConfirmPassword() {
        if (confirmpassword.length > 0 && confirmpassword != password) {
            return (
                <Text fontSize='sm' color={"#f87171"} >
                    *Passwords are not the same.
                </Text>
            )
        }
    }

    return (
        <ScrollView>
        <Center>
            <Center height='80%' width='80%'>
            <Image 
                    style={{width: 200, height: 200}}
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
                <Box _text={{opacity: 0}}>
                    Invisible words
                </Box>
                <Box>
                    <Checkbox value="First Agreement" size="sm" onChange={state => {
                        if (state) {
                            setChecked1(true);  
                        } else {
                            setChecked1(false);
                        }
                    }}>
                        I agree to JioMe's Terms of service.
                    </Checkbox>
                    <Box _text={{opacity: 0}}>
                    Invisible words
                    </Box>
                    <Checkbox value="Second Agreement" size="sm" onChange={state => {
                        if (state) {
                            setChecked2(true); 
                        } else {
                            setChecked2(false);
                        }
                    }}>
                        I accept JioMe's use of my data for the service and everything else described in the Privacy Policy and Data Processing Agreement.
                    </Checkbox>
                </Box>                
                <AuthButton onPressHandler={handleSignUp} title='Sign Up'/>
                <Text style={{marginTop:'10%'}} fontSize='sm'>
                    Existing user? &nbsp;
                    <Text underline color='orange.500' onPress={() => navigation.navigate('SignIn')}>          
                    Sign in now!
                    </Text>
                </Text>

            </Center>
        </Center>    
        </ScrollView>
 
    )
}

export default SignUpPage;