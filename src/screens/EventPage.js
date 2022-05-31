import React, { useState } from "react";
import { Dimensions, ImageBackground, StyleSheet } from 'react-native';
import { Text, View, Icon, IconButton, HStack, VStack, Avatar } from "native-base";
import { SpecialWrapper } from "../components/eventPage/SpecialWrapper";
import { Detail } from "../components/eventPage/Detail";
import { MaterialIcons } from "@native-base/icons";
import { Ionicons } from "@native-base/icons";
import LinearGradient from "react-native-linear-gradient";
import CustomButton from "../components/basic/CustomButton";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const EventPage = () => {
    const [liked, setLiked] = useState(false);

    const toggleLiked = () => {
        setLiked(!liked);
    }

    return (
        <SpecialWrapper>
            <ImageBackground style={{backgroundColor:'#fb923c'}}>
                <View width='100%' alignItems='center'>
                    <ImageBackground
                        style={{height:windowHeight*0.35, width:'100%'}}
                        source={require('../assets/forest.jpeg')}
                    >
                        <LinearGradient 
                            colors={['#00000000', '#fb923c']} 
                            style={{height : '100%', width : '100%'}}>
                        </LinearGradient>
                        <IconButton position='absolute' style={{transform:[{translateX:350}, {translateY:5}]}} bgColor='gray.300:alpha.60'
                            icon={<Icon as={MaterialIcons} name={liked ? 'favorite' : 'favorite-outline'} color={liked ? 'red.500' : 'white'} />}
                            borderRadius="full"
                            _icon={{
                                size: "2xl"
                            }} 
                            _hover={{
                            bg: "red.300:alpha.20",
                            
                            }} 
                            _pressed={{
                            bg: "red.300:alpha.20",
                            }}
                            //delayLongPress='300'
                            onPress={toggleLiked}
                            //onLongPress={() => { displayLabel(); onLongPressHandler();}}
                            //onPressOut={hideLabel}
                        />
                    </ImageBackground>

                    <View alignItems='center' style={{transform:[{translateY:-50}]}}>
                        <View style={styles.eventTitle} bgColor='white' shadow={5}>
                            <Text textAlign='center' fontSize='2xl' color='gray.600'>Event Name</Text>
                        </View>   
                    </View>
                </View>

                <View style={{transform:[{translateY:-20}]}} padding='3%'>
                    <HStack justifyContent='space-between'>
                        <VStack space={2} width='30%' alignItems='center'>
                            <Icon as={Ionicons} name='location' color='white' size={65} />
                            <Text color='gray.100' textAlign='center'>Sungei Buloh Nature Reserve</Text>
                        </VStack>
                
                        <VStack space={2} width='30%' alignItems='center'>
                            <Icon as={Ionicons} name='time' color='white' size={65} />
                            <Text color='gray.100' textAlign='center'>Mon - Sun</Text>
                            <Text color='gray.100' textAlign='center'>20 May 22 - {"\n"} 26 May 22</Text>
                            <Text color='gray.100' textAlign='center'>0800 - 1000 hrs</Text>
                        </VStack>

                        <VStack space={2} width='30%' alignItems='center'>
                            <Icon as={Ionicons} name='people' color='white' size={65} />
                            <Text color='gray.100' textAlign='center'>10/15{"\n"}available</Text>
                        </VStack>
                    </HStack>       
                </View>

            </ImageBackground>

            <VStack space={8} padding='5%'>
                <Detail title="About">
                        <View>
                            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Facilisis leo vel fringilla est. Phasellus egestas tellus rutrum tellus pellentesque eu. Erat velit scelerisque in dictum non consectetur.</Text>
                        </View>
                </Detail>

                <Detail title="Participants">
                    <View alignItems='flex-start'>
                        <Avatar.Group _avatar={{
                            size: "lg"
                            }} max={3}>
                                <Avatar bg="green.500" source={{
                                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                            }}>
                                AJ
                                </Avatar>
                                <Avatar bg="cyan.500" source={{
                                uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                            }}>
                                TE
                                </Avatar>
                                <Avatar bg="indigo.500" source={{
                                uri: "https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                            }}>
                                JB
                                </Avatar>
                                <Avatar bg="amber.500" source={{
                                uri: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                            }}>
                                TS
                                </Avatar>
                                <Avatar bg="green.500" source={{
                                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                            }}>
                                AJ
                                </Avatar>
                        </Avatar.Group>
                    </View>
                </Detail>

                <CustomButton 
                    title='Join Now!' 
                    width='100%' 
                    color='#f97316'// orange.500
                    onPressHandler={() => alert("Pressed")}
                    isDisabled={false}
                />
            </VStack>
        </SpecialWrapper>



    )
}

const styles = StyleSheet.create({
    eventTitle:{
        maxWidth:'80%', 
        paddingTop:'2%',
        paddingBottom:'2%',
        paddingLeft:'5%',
        paddingRight:'5%',
        alignSelf:'flex-start',
    }

})

export default EventPage;