import React from "react"
import { Pressable, View, Text, VStack, HStack, Icon  } from "native-base"
import { Ionicons } from "@native-base/icons";


export const UpcomingEventCard = ({ name, location, daysToEvent }) => {
    return <Pressable width='100%'>
        {({
        isHovered,
        isFocused,
        isPressed
    }) => {
        return <View borderRadius={5} bgColor={isPressed ? "gray.300" : isHovered ? "orange.200" : "gray.200"}>
            <Text fontSize='md' fontWeight='medium' textAlign='right' paddingTop='3%' paddingRight='3%'>{name}</Text>
            <VStack>
                <HStack space={2} padding='2%' alignItems='center'>
                        <Icon as={Ionicons} name={isPressed ? "location" : isHovered ? "location" :'location-outline'} color={isPressed ? "orange.600:alpha.80" : isHovered ? "orange.600" :'black'} size={45} />
                        <Text fontWeight='medium'  flex={1} flexWrap='wrap'>{location}</Text>
                </HStack>
                <HStack space={2} padding='2%' alignItems='center'>
                        <Icon as={Ionicons} name={isPressed ? "alarm" : isHovered ? "alarm" :'alarm-outline'} color={isPressed ? "orange.600:alpha.80" : isHovered ? "orange.600" :'black'} size={45} />
                        {/* reminder of days to event; hours if 24h prior */}
                        <Text fontWeight='medium' flex={1} flexWrap='wrap'>Starts in {daysToEvent} time</Text>
                </HStack>
            </VStack>
        </View>
    }}
    </Pressable>
}