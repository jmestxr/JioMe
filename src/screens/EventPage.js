import React, { useState, useEffect } from "react";
import { Dimensions, ImageBackground, StyleSheet} from 'react-native';
import { Text, View, Icon, IconButton, HStack, VStack} from "native-base";
import { SpecialWrapper } from "../components/eventPage/SpecialWrapper";
import { EssentialDetail } from "../components/basic/EssentialDetail";
import { Detail } from "../components/eventPage/Detail";
import CustomButton from "../components/basic/CustomButton";
import { TextCollapsible } from "../components/eventPage/TextCollapsible";
import { AvatarsCollapsible } from "../components/eventPage/AvatarsCollapsible";
import { MaterialIcons } from "@native-base/icons";
import { Ionicons } from "@native-base/icons";
import LinearGradient from "react-native-linear-gradient";
import { supabase } from "../../supabaseClient";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../components/contexts/Auth";

import { handleLikeEvent, handleUnlikeEvent, getEventPicture } from "../functions/eventHelpers";


const windowHeight = Dimensions.get('window').height;

const EventPage = ({ route }) => {
    const isFocused = useIsFocused();
    const { user } = useAuth()
    
    const { eventId } = route.params; // the unique id of this event

    const [liked, setLiked] = useState(false);

    // Details of this event
    const [eventDetails, setEventDetails] = useState({
                                                        title:'', 
                                                        description:'', 
                                                        location:'', 
                                                        from_datetime:'', 
                                                        to_datetime:'',
                                                         max_capacity:'', 
                                                         picture_url:'' 
                                                    });

    const [currCapacity, setCurrCapacity] = useState(0)

    const [datetimePeriod, setDatetimePeriod] = useState({ day: '', date: '', time: '' })
    // e.g. {day: 'Thursday', date: '2 Jun 2022', time: '1800 - 1900 hrs'}
    // e.g. {day: 'Mon - Sat', date: '2 Jun 2022 - 7 Jun 2022', time: '1800 - 1900 hrs'}

    const [participantsAvatars, setParticipantsAvatars] = useState([])



    useEffect(() => {
        getEventDetails()
            .then(() => getCurrCapacity())
            .then(() => getParticipantsAvatars());
        getLikedState();
    }, [isFocused])

    // this function is called when 'liked button' is pressed
    const toggleLiked = async () => {
        if (liked) {
            handleUnlikeEvent(user.id, eventId);
        } else {
            handleLikeEvent(user.id, eventId);
        }
        setLiked(!liked);
    }

    // function to get the user's liked status of this event (whether user has liked it or not as of current state)
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
                formatEventPeriod(data.from_datetime, data.to_datetime);
            }
        }
        catch (error) {
            alert(error.error_description || error.message)
        }
    }

    const getCurrCapacity = async (e) => {
        try {
            const { data, count, error } = await supabase
                .from('user_joinedevents')
                .select('user_id, event_id', { count: 'exact' })
                .match({event_id: eventId})
            if (error) throw error
            if (data) {   
                setCurrCapacity(count);
            }
        } catch (error) {
            alert(error.error_description || error.message)
        }
    }


    // function stores list of avatar private URLS in participantsAvatars
    const getParticipantsAvatars = async (e) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, user_joinedevents!inner(*)')
                .eq('user_joinedevents.event_id', eventId)     
            
            if (error) throw error
            if (data) {
                setParticipantsAvatars(data)
            }
        } catch (error) {
            alert(error.error_description || error.message);
        }
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

    const formatAvailCapacity = (currCapacity, maxCapacity) => {
        const availCapacity = maxCapacity - currCapacity;
        return availCapacity.toString() + '/' + maxCapacity.toString() + '\n' + 'available';
    }


    return (
        <SpecialWrapper>
            <ImageBackground style={{backgroundColor:'#f97316'}}>
                <View width='100%' alignItems='center'>
                    <ImageBackground
                        style={{height:windowHeight*0.35, width:'100%'}}
                        source={getEventPicture(eventDetails.picture_url)}
                    >
                        <LinearGradient 
                            colors={['#00000000', '#f97316']} 
                            style={{height : '100%', width : '100%'}}>
                        </LinearGradient>
                        <IconButton position='absolute' style={{transform:[{translateX:350}, {translateY:5}]}} bgColor='gray.300:alpha.50'
                            icon={<Icon as={MaterialIcons} name={liked ? 'favorite' : 'favorite-outline'} color={liked ? 'red.500' : 'white'} />}
                            borderRadius="full"
                            _icon={{
                                size: "xl"
                            }} 
                            _hover={{
                            bg: "red.300:alpha.20",
                            
                            }} 
                            _pressed={{
                            bg: "red.300:alpha.20",
                            }}
                            onPress={toggleLiked}
                        />
                    </ImageBackground>

                    <View alignItems='center'>
                        <View style={styles.eventTitle} bgColor='white'>
                            <Text textAlign='center' fontSize='2xl'>{eventDetails.title}</Text>
                        </View>   
                    </View>
                </View>

                <View marginTop='5%' marginBottom='3%'  padding='3%'>
                    <HStack justifyContent='space-between'>
                        <EssentialDetail 
                            width='30%'
                            iconName='location'
                            iconColor='white'>
                             <Text color='white' textAlign="center">{eventDetails.location}</Text>
                        </EssentialDetail>

                        <EssentialDetail 
                            width='30%'
                            iconName='time'
                            iconColor='white'>
                            <Text color='white' textAlign='center'>{datetimePeriod.day}</Text>
                            <Text color='white' textAlign='center'>{datetimePeriod.date}</Text>
                            <Text color='white' textAlign='center'>{datetimePeriod.time}</Text>
                        </EssentialDetail>
                        
                        <EssentialDetail 
                            width='30%'
                            iconName='people'
                            iconColor='white'>
                            <Text color='white' textAlign='center'>
                                {formatAvailCapacity(currCapacity, eventDetails.max_capacity)}
                            </Text>
                        </EssentialDetail>
                    </HStack>       
                </View>
                

            </ImageBackground>

            <VStack space={8} padding='5%'>
                <Detail title="About">
                        <TextCollapsible longText={eventDetails.description}/>
                </Detail>

                <Detail title="Participants">
                    <AvatarsCollapsible avatarUrls={participantsAvatars} />
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
        paddingTop:'3%',
        paddingBottom:'3%',
        paddingLeft:'7%',
        paddingRight:'7%',
        alignSelf:'flex-start',
    }

})

export default EventPage;