import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Center, Input, VStack, Icon, Button, Text } from 'native-base';
import { MaterialIcons } from "@native-base/icons";
import { useNavigation, StackActions } from '@react-navigation/native';
import { useAuth } from './contexts/Auth';

const SignInPage = () => {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // const navigation = useNavigation(); 

    // // Get signIn function from the auth context
    // const { signIn } = useAuth()

    // const handleSignIn = async (e) => {
    //   e.preventDefault()

    //   setLoading(true)

    //   // Calls `signIn` function from the context
    //   const { error } = await signIn({ email, password })

    //   if (error) {
    //     alert('error signing in')
    //   } else {
    //     setEmail('')
    //     setPassword('')
    //     // Redirect user to Dashboard
    //     const pushAction = StackActions.push('Dashboard');
    //     navigation.dispatch(pushAction);
    //   }

    //   setLoading(false)
    // }
    
        
    return (
        <Center>
            <Center height='80%' width='80%'>
                <Image 
                    style={{width: 200, height: 200}}
                    source={require('../assets/logo.png')} 
                />

                <VStack space={4} alignItems="center">
                    <View style={styles.fieldBox}>
                        <Icon as={MaterialIcons} name="mail-outline" color='black' size='xl' style={{marginRight: '4%'}} />
                        <Input 
                        variant='underlined' 
                        size='xl' 
                        _focus={{ borderColor: 'orange.500' }}
                        placeholder='Email'    
                        value={email} 
                        onChangeText={(text) => setEmail(text)} 
                        />
                    </View>
                    <View style={styles.fieldBox}>
                        <Icon as={MaterialIcons} name="lock-outline" color='black' size='xl' style={{marginRight: '4%'}} />
                        <Input
                        variant='underlined' 
                        size='xl' 
                        _focus={{ borderColor: 'orange.500' }}
                        placeholder='Password' 
                        secureTextEntry={true} 
                        value={password} 
                        onChangeText={(text) => setPassword(text)} 
                        />
                    </View>
                </VStack>

                <Button style={{width:'30%', marginTop:'6%'}} bg='orange.500' _text={{fontSize:'md'}} size='md' onPress={() => alert("Sign In")}>Sign In</Button>

                <Text style={{marginTop:'10%'}}fontSize='sm'>
                    New user? &nbsp;
                    {/* <Text underline color='orange.500' onPress={() => navigation.navigate('SignUp')}>           */}
                    <Text underline color='orange.500'>          
                    Sign up now!
                    </Text>
                </Text>
            </Center>
        </Center>
        
    )
};

const styles = StyleSheet.create({
      fieldBox: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '85%'
      }
});

export default SignInPage;