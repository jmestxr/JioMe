import React, { useState, useEffect } from "react";
import { Dimensions, ImageBackground, StyleSheet} from 'react-native';
import { Text, View, Icon, IconButton, HStack, VStack, Avatar, Button } from "native-base";
import { SpecialWrapper } from "../components/eventPage/SpecialWrapper";
import { Detail } from "../components/eventPage/Detail";
import CustomButton from "../components/basic/CustomButton";
import { TextCollapsible } from "../components/eventPage/TextCollapsible";
import { MaterialIcons } from "@native-base/icons";
import { Ionicons } from "@native-base/icons";
import LinearGradient from "react-native-linear-gradient";
import { supabase } from "../../supabaseClient";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../components/contexts/Auth";

import { handleLikeEvent, handleUnlikeEvent } from "../functions/eventHelpers";



const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const EventPage = ({ route }) => {
    const isFocused = useIsFocused();
    const { user } = useAuth()
    
    const { eventId } = route.params; // the unique id of this event

    const [liked, setLiked] = useState(false);

    // Details of this event
    const [eventDetails, setEventDetails] = useState({});

    const [capacity, setCapacity] = useState('')

    const [datetimePeriod, setDatetimePeriod] = useState({ day: '', date: '', time: '' })
    // e.g. {day: 'Thursday', date: '2 Jun 2022', time: '1800 - 1900 hrs'}
    // e.g. {day: 'Mon - Sat', date: '2 Jun 2022 - 7 Jun 2022', time: '1800 - 1900 hrs'}

    const [participantsAvatars, setParticipantsAvatars] = useState([])


    useEffect(() => {
        getEventDetails()
            .then(() => getParticipantsAvatars());
        getLikedState();

        return () => {
            setEventDetails({});
            setParticipantsAvatars([]);
        };
    }, [isFocused])

    const toggleLiked = async () => {
        if (liked) {
            handleUnlikeEvent(user.id, eventId);
        } else {
            handleLikeEvent(user.id, eventId);
        }
        setLiked(!liked);
    }

    const getLikedState = async (e) => {
        try {
            const { data, count, error } = await supabase
                .from('user_likedevents')
                .select('user_id, event_id', { count: 'exact' })
                .match({user_id: user.id, event_id: eventId})
            if (error) throw error
            if (data) {   
                setLiked(count == 1);
            }
        }
        catch (error) {
            alert(error.error_description || error.message)
        }
    }


    const getEventDetails = async (e) => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', eventId)
                .single()
            if (error) throw error
            if (data) {
                setEventDetails(data);
                formatCapacity(data.curr_capacity, data.max_capacity);
                formatEventPeriod(data.from_datetime, data.to_datetime);
            }
        }
        catch (error) {
            alert(error.error_description || error.message)
        }
    }

    const getParticipantsAvatars = async (e) => {
        Object.values(eventDetails.participants_id).map(async (participantId, index) => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('avatar_url')
                    .eq('id', participantId)
                    .single()
                if (error) throw error
                if (data) {
                    setParticipantsAvatars(oldArray => [...oldArray, data.avatar_url])
                }
            } catch (error) {
                alert(error.error_description || error.message);
            }
        })
    }

    const formatEventPeriod = (fromTimeStamp, toTimeStamp) => {
        const weekdayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const weekdayLong = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        const from = new Date(fromTimeStamp);
        const to = new Date(toTimeStamp);
        const fromDate = fromTimeStamp.slice(0, 10);
        const toDate = toTimeStamp.slice(0, 10);

        if (fromDate == toDate) { // if event only lasts within the same day
            setDatetimePeriod(prev => ({
                ...prev,
                day: weekdayLong[from.getDay()]
            }));
            setDatetimePeriod(prev => ({
                ...prev,
                date: from.getDate() + ' ' + month[from.getMonth()] + ' ' + from.getFullYear()
            }));
        } else {
            setDatetimePeriod(prev => ({
                ...prev,
                day: weekdayShort[from.getDay()] + ' - ' + weekdayShort[to.getDay()]
            }));
            setDatetimePeriod(prev => ({
                ...prev,
                date: from.getDate() + ' ' + month[from.getMonth()] + ' ' + from.getFullYear() + ' - ' + '\n' +
                                to.getDate() + ' ' + month[to.getMonth()] + ' ' + to.getFullYear()
            }));
        }
        setDatetimePeriod(prev => ({
            ...prev,
            time: String(from.getUTCHours()).padStart(2, '0') + String(from.getMinutes()).padStart(2, '0') + 
                            ' - ' + String(to.getUTCHours()).padStart(2, '0') + String(to.getMinutes()).padStart(2, '0') + ' hrs'
        }));
    }

    const formatCapacity = (currCapacity, maxCapacity) => {
        const availCapacity = maxCapacity - currCapacity;
        setCapacity(availCapacity.toString() + '/' + maxCapacity.toString() + '\n' + 'available');
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
                        <IconButton position='absolute' style={{transform:[{translateX:350}, {translateY:5}]}} bgColor='gray.300:alpha.50'
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
                            <Text textAlign='center' fontSize='2xl' color='gray.600'>{eventDetails.title}</Text>
                        </View>   
                    </View>
                </View>

                <View style={{transform:[{translateY:-20}]}} padding='3%'>
                    <HStack justifyContent='space-between'>
                        <VStack space={2} width='30%' alignItems='center'>
                            <Icon as={Ionicons} name='location' color='white' size={65} />
                            <Text color='gray.100' textAlign='center'>{eventDetails.location}</Text>
                        </VStack>
                
                        <VStack space={2} width='30%' alignItems='center'>
                            <Icon as={Ionicons} name='time' color='white' size={65} />
                            <Text color='gray.100' textAlign='center'>{datetimePeriod.day}</Text>
                            <Text color='gray.100' textAlign='center'>{datetimePeriod.date}</Text>
                            <Text color='gray.100' textAlign='center'>{datetimePeriod.time}</Text>
                        </VStack>

                        <VStack space={2} width='30%' alignItems='center'>
                            <Icon as={Ionicons} name='people' color='white' size={65} />
                            <Text color='gray.100' textAlign='center'>{capacity}</Text>
                        </VStack>
                    </HStack>       
                </View>

            </ImageBackground>

            <VStack space={8} padding='5%'>
                <Detail title="About">
                        {/* <View>
                            <Text>{eventDetails.description}</Text>
                        </View> */}
                        <TextCollapsible longText={eventDetails.description}/>
                </Detail>

                <Detail title="Participants">
                    <View alignItems='flex-start' >
                        {/* <Avatar.Group _avatar={{
                            size: "lg"
                            }}> */}

                            {participantsAvatars.map((avatarUrl, index) => {
                                return <Avatar key={index} bg="green.500" source={{uri: avatarUrl}}>
                                   {/* { alert(avatarUrl)} */}
                                    AJ
                                    </Avatar>
                            })}
                                {/* <Avatar bg="green.500" source={{
                                uri: "https://srvrelwrbtcqkozbprvh.supabase.co/storage/v1/object/sign/avatars/person.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL3BlcnNvbi5wbmciLCJpYXQiOjE2NTQ0MzkzODgsImV4cCI6MTk2OTc5OTM4OH0.jdMY5_nMUwNyhPXD6shmATO8QG-gWU4w2f0OwCvfxwc"
                            }}>
                                AJ
                                </Avatar> */}
          
                                
                        {/* </Avatar.Group> */}
                    </View>
                </Detail>

                <CustomButton 
                    title='Join Now!' 
                    width='100%' 
                    color='#f97316'// orange.500
                    onPressHandler={() => alert("Join Event?")}
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