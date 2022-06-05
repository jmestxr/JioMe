import React from "react";
import { Dimensions } from "react-native";
import { Text, Icon, Pressable, Square, PresenceTransition, View } from "native-base"
import { MaterialIcons } from "@native-base/icons";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get('window').width;

export const SquareNav = () => {
    const navigation = useNavigation(); 
    return (
        <View>
             <View flexDirection='row'>
                    <Pressable onPress={() => navigation.navigate('Marketplace')}>
                        {({
                        isHovered,
                        isFocused,
                        isPressed
                    }) => {
                        return <Square size={windowWidth/2.5} style={{elevation:1}}
                            bg={isPressed ? "orange.200" : isHovered ? "orange.200:alpha.50" : "orange.400"}>

                        <Icon as={MaterialIcons} name='shopping-cart' color='white' size={70} />
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
                                <Text fontWeight='medium' color='black'>Join an event</Text>
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
                            // borderColor='orange.400'
                            // borderWidth={isPressed ? '0' : '1'}
                            style={{elevation:1}}
                            bg={isPressed ? "orange.200" : isHovered ? "orange.400" : "#f2f2f2"}>

                        <Icon as={MaterialIcons} name='group-add' color={isPressed ? 'white' : 'orange.400'} size={70} />
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
                                <Text fontWeight='medium' color='black'>Create an event</Text>
                            </PresenceTransition>
                        </Square>
                    }}
                    </Pressable>
                </View>
                <View height='100'></View> 
        </View>
       
    )
    
}