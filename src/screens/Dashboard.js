import React, { useState, useEffect } from "react";
import { useAuth } from "../components/contexts/Auth";
import { Text, HStack, Icon, Pressable, Square, PresenceTransition, View, Avatar } from "native-base"
import { Dimensions } from "react-native";
import { Wrapper } from "../components/basic/Wrapper";
import { MaterialIcons } from "@native-base/icons";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../supabaseClient";

const windowWidth = Dimensions.get('window').width;

const Dashboard = () => {
    const [username, setUsername] = useState('')

    const navigation = useNavigation(); 

    useEffect(() => {
        getUsername()
    })

    const { user } = useAuth()

    const getUsername = async (e) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single()
            if (error) throw error
            if (data) {
                setUsername(data.username)
            }
        }
        catch (error) {
            alert(error.error_description || error.message)
        }
    }

    return (
        <Wrapper>
            <HStack justifyContent='space-between' alignItems='center'>
                <Text fontSize="2xl">Welcome back, {"\n"} {username}!</Text>
                <Avatar bg="gray.300" size="xl" marginRight="3%" source={{uri: ''}}>
                        JM
                </Avatar>
            </HStack>
 
            <View width='100%' alignItems='center' marginTop='15%'>
                <Text fontSize="lg" fontWeight='semibold' marginBottom='3%'>You have no upcoming events.</Text>

                <View flexDirection='row'>
                    <Pressable onPress={() => navigation.navigate('Marketplace')}>
                        {({
                        isHovered,
                        isFocused,
                        isPressed
                    }) => {
                        return <Square size={windowWidth/2.5}
                            bg={isPressed ? "orange.200" : isHovered ? "orange.200:alpha.50" : "orange.400"}>

                        <Icon as={MaterialIcons} name='shopping-cart' color='white' size={100} />
                            <PresenceTransition 
                                visible={isPressed} 
                                initial={{opacity: 0}} 
                                animate={{
                                    opacity: 1,
                                    transition: {
                                    duration: 250
                                    }
                                }}
                                position='absolute'
                            >
                                <Text fontSize="md" fontWeight='medium' color='black'>Join an event</Text>
                            </PresenceTransition>
                        </Square>
                    }}
                    </Pressable>

                    {/* Invisible Square */}
                    <Square size={windowWidth/2.5}></Square>
                </View>
                
                <View flexDirection='row'>
                    {/* Invisible Square */}
                    <Square size={windowWidth/2.5}></Square>

                    <Pressable onPress={() => navigation.navigate('Create')}>
                        {({
                        isHovered,
                        isFocused,
                        isPressed
                    }) => {
                        return <Square size={windowWidth/2.5}
                            borderColor='orange.400'
                            borderWidth={isPressed ? '0' : '1'}
                            bg={isPressed ? "orange.200" : isHovered ? "orange.400" : "#f2f2f2"}>

                        <Icon as={MaterialIcons} name='group-add' color={isPressed ? 'white' : 'orange.400'} size={100} />
                            <PresenceTransition 
                                visible={isPressed} 
                                initial={{opacity: 0}} 
                                animate={{
                                    opacity: 1,
                                    transition: {
                                    duration: 250
                                    }
                                }}
                                position='absolute'
                            >
                                <Text fontSize="md" fontWeight='medium' color='black'>Create an event</Text>
                            </PresenceTransition>
                        </Square>
                    }}
                    </Pressable>
                </View>
            </View>

        </Wrapper>
      )
}

export default Dashboard;