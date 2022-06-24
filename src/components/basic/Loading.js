import React from "react";
import { View, Spinner, Center } from "native-base";


export const Loading = (props) => {
    const {size='lg', color='orange.600'} = props;

    return (
        <Center width='100%' height='100%'>
            <Spinner size={size} color={color} />
        </Center>
    )
}