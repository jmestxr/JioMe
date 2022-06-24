import React from "react";
import { View, Icon, Text } from "native-base";
import { MaterialIcons } from "@native-base/icons";


export const Warning = ({ warningMessage, textColor='red.400' }) => {
    return (
        <View flexDirection='row' alignItems='center'>
            <Icon as={MaterialIcons} name='error-outline' color={textColor} size='sm' marginRight='1%'/>
            <Text fontSize='sm' color={textColor} >
                { warningMessage }
            </Text>
        </View> 
    )
}