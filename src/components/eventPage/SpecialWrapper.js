import React from "react";
import { ScrollView, View } from "native-base";

// Wrapper for screens with ScrollView
export const SpecialWrapper = ({ children }) => {
    return (
            <ScrollView>
                <View height='100%' width='100%' alignItems='center'>
                    <View width='100%'>
                        {/* All content should be provided here. */}
                        { children }
                    </View>
                </View>
            </ScrollView>
     

    )
}