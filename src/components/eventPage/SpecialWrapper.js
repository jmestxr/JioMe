import React from "react";
import { ScrollView, View } from "native-base";

// Wrapper for screens with ScrollView
export const SpecialWrapper = ({ children }) => {
    return (
        // <ImageBackground source={require('../../assets/forest.jpeg')} imageStyle={{opacity:0.5}}>
        // <ImageBackground style={{backgroundColor:'#f97316'}}>
        //     <ScrollView>
        //         <View height='100%' width='100%' alignItems='center'>
        //             <View width='97%'>
        //                 <ImageBackground style={{backgroundColor:'#f2f2f2', borderRadius:8}}>
        //                     {/* All content should be provided here. */}
        //                     { children }
        //                 </ImageBackground>
        //             </View>
                    
        //         </View>
        //     </ScrollView>
        // </ImageBackground>


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