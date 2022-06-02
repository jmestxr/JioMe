import React, { useState, useEffect } from "react";
import { Dimensions, ImageBackground, StyleSheet} from 'react-native';
import { Text, View, Icon, IconButton, HStack, VStack, Avatar, Button } from "native-base";
import { SpecialWrapper } from "../components/eventPage/SpecialWrapper";
import { Detail } from "../components/eventPage/Detail";
import CustomButton from "../components/basic/CustomButton";
import { MaterialIcons } from "@native-base/icons";
import { Ionicons } from "@native-base/icons";
import LinearGradient from "react-native-linear-gradient";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../components/contexts/Auth";


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const EventPage = ({ route }) => {

    const { user } = useAuth()
    
    const { eventId } = route.params; // the unique id of this event

    const [liked, setLiked] = useState(false);

    // Details of this event
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const [availCapacity, setAvailCapacity] = useState('')
    const [maxCapacity, setMaxCapacity] = useState('')
    const [description, setDescription] = useState('')
    const [dayPeriod, setDayPeriod] = useState('') // e.g. Mon - Sat
    const [datePeriod, setDatePeriod] = useState('') // e.g. 2 Jun 2022 - 7 Jun 2022
    const [timePeriod, setTimePeriod] = useState('') // e.g. 1800 - 1900 hrs

    useEffect(() => {
        getEventDetails();
        getLikedState();
    }, [])

    // If event is already liked by user, then calling this function will unlike this event (vice versa).
    const toggleLiked = async (e) => {
        if (liked) { // if at first, this event was liked
            try {
                const { data, error } = await supabase
                    .rpc('delete_array_record', 
                            { _table:'profiles', 
                                _id_column:'id', 
                                _target_column:'liked_events', 
                                row_id:user.id, 
                                record:eventId })
                if (error) throw error
            }
            catch (error) {
                alert(error.error_description || error.message)
            }
        } else {
            try {
                const { data, error } = await supabase
                    .rpc('add_array_record', 
                            { _table:'profiles', 
                                _id_column:'id', 
                                _target_column:'liked_events', 
                                row_id:user.id, 
                                record:eventId })
                if (error) throw error
            }
            catch (error) {
                alert(error.error_description || error.message)
            }
        }

        setLiked(!liked);
    }

    const getLikedState = async (e) => {
        try {
            const { data, count, error } = await supabase
                .from('profiles')
                .select('id, liked_events', { count: 'exact' })
                .eq('id', user.id)
                .contains('liked_events', [eventId])
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
                setTitle(data.title);
                setLocation(data.location);
                setAvailCapacity(data.max_capacity - data.curr_capacity);
                setMaxCapacity(data.max_capacity);
                setDescription(data.description);
                formatEventPeriod(data.from_datetime, data.to_datetime);
            }
        }
        catch (error) {
            alert(error.error_description || error.message)
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
            setDayPeriod(weekdayLong[from.getDay()]);
            setDatePeriod(from.getDate() + ' ' + month[from.getMonth()] + ' ' + from.getFullYear());
        } else {
            setDayPeriod(weekdayShort[from.getDay()] + ' - ' + weekdayShort[to.getDay()]);
            setDatePeriod(from.getDate() + ' ' + month[from.getMonth()] + ' ' + from.getFullYear() + ' - ' + '\n' +
                            to.getDate() + ' ' + month[to.getMonth()] + ' ' + to.getFullYear());
        }
        setTimePeriod(String(from.getUTCHours()).padStart(2, '0') + String(from.getMinutes()).padStart(2, '0') + 
                        ' - ' + String(to.getUTCHours()).padStart(2, '0') + String(to.getMinutes()).padStart(2, '0') + ' hrs');
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
                            <Text textAlign='center' fontSize='2xl' color='gray.600'>{title}</Text>
                        </View>   
                    </View>
                </View>

                <View style={{transform:[{translateY:-20}]}} padding='3%'>
                    <HStack justifyContent='space-between'>
                        <VStack space={2} width='30%' alignItems='center'>
                            <Icon as={Ionicons} name='location' color='white' size={65} />
                            <Text color='gray.100' textAlign='center'>{location}</Text>
                        </VStack>
                
                        <VStack space={2} width='30%' alignItems='center'>
                            <Icon as={Ionicons} name='time' color='white' size={65} />
                            <Text color='gray.100' textAlign='center'>{dayPeriod}</Text>
                            {/* <Text color='gray.100' textAlign='center'>20 May 22 - {"\n"} 26 May 22</Text> */}
                            <Text color='gray.100' textAlign='center'>{datePeriod}</Text>
                            <Text color='gray.100' textAlign='center'>{timePeriod}</Text>
                        </VStack>

                        <VStack space={2} width='30%' alignItems='center'>
                            <Icon as={Ionicons} name='people' color='white' size={65} />
                            <Text color='gray.100' textAlign='center'>{availCapacity}/{maxCapacity}{"\n"}available</Text>
                        </VStack>
                    </HStack>       
                </View>

            </ImageBackground>

            <VStack space={8} padding='5%'>
                <Detail title="About">
                        <View>
                            <Text>{description}</Text>
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

                <Button onPress={getLikedState}>Press me</Button>
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