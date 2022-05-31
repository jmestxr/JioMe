import React from "react";
import { Text, View, Divider, VStack } from "native-base";

export const Detail = ({ children, title }) => {
    return (
        <VStack>
            <View alignItems='center' justifyContent='center'>
                    <Text width='100%' fontSize='md'>{title}</Text>
                    <Divider my="2" />
            </View>
            {children}
        </VStack>
    )
}