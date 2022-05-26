import React from "react";
import { View, Icon, Text } from "native-base";
import { MaterialIcons } from "@native-base/icons";


export const Warning = ({ warningMessage }) => {
    return (
        <View flexDirection='row' alignItems='center'>
            <Icon as={MaterialIcons} name='error-outline' color='red.400' size='sm' marginRight='1%'/>
            <Text fontSize='sm' color='red.400' >
                { warningMessage }
            </Text>
        </View> 
    )
}