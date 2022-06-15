import React from "react";
import { Text, Box, Pressable, HStack, VStack } from "native-base";
import EventPictureFormat from "./EventPictureFormat";
import { supabase } from '../../../supabaseClient'



const EventFormat = (props) => {
    const { id, title, from_datetime, to_datetime, picture_url } = props;
    const { publicURL, error } = supabase
      .storage
      .from('eventpics')
      .getPublicUrl(picture_url)

    function checkPic() {
        // will no longer show the stock photo
        if (publicURL == undefined || publicURL == 'null' || publicURL == '' || publicURL == null) {
            return <EventPictureFormat source={require('../../assets/events.jpg')} height={"65%"} width={"100%"}/>
        } else {
            return <EventPictureFormat source = {{ uri: publicURL }} height={"65%"} width={"100%"}/>

        }
    }

    return (<Box alignItems="center">
        <Pressable width={"full"} onPress={() => console.log("TODO: Direct to Event's screen.")} rounded="8" overflow="hidden" borderWidth="1" borderColor="coolGray.300" maxW="96" shadow="3" bg="coolGray.100" p="5">
            <Box height={250}>
                <VStack height={"100%"} width="100%" space={2} alignItems="center">
                {/* <EventPictureFormat source = {{ uri: publicURL }} height={"65%"} width={"100%"}/> */}
                {checkPic()}
                <HStack width={"100%"} height={"35%"} alignItems="center" justifyContent='space-between'>
                <Box rounded={8} height={'100%'} width={"45%"} p={"2"} alignItems="center" textAlign="center" bg="orange.400" _text={{
                            textAlign:'center', 
                            fontSize: "sm",
                            fontWeight: "medium",
                            color: "warmGray.50",
                            letterSpacing: "lg"
                        }}>
                            Title: {title}
                        </Box>
                        <Box rounded={8} height={'100%'} width={"45%"} p={"2"} alignItems="center" textAlign="center" bg="orange.400" _text={{
                            textAlign:'center', 
                            fontSize: "sm",
                            fontWeight: "medium",
                            color: "warmGray.50",
                            letterSpacing: "lg"
                        }}>
                            Start Date: {from_datetime.slice(0, 10) + "\n" + from_datetime.slice(-8, -3)}
                        </Box>
                </HStack>
                </VStack>
            </Box>
            
            
            
        </Pressable>
    </Box>)
}

export default EventFormat;
