import React from "react";
import { View, Spinner, Center } from "native-base";


export const Loading = () => {
    return (
        <Center width='100%' height='100%'>
            <Spinner size="lg" color='orange.600' />
        </Center>
    )
}