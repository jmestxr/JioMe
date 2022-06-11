import React from "react";
import { ScrollView, View } from "native-base";
import { FocusAwareStatusBar } from "./FocusAwareStatusBar";

// Wrapper for screens with ScrollView
export const Wrapper = ({ children, contentViewStyle, statusBarColor }) => {
    return (
        <ScrollView>
            <FocusAwareStatusBar backgroundColor={statusBarColor} />
            <View height='100%' width='100%' alignItems='center'>
                <View paddingBottom='5%' style={contentViewStyle}>
                    {/* All content should be provided here. */}
                    { children }
                </View>
            </View>
        </ScrollView>
    )
}