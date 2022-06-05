// import { ChangeEventHandler } from 'react'

// export type UploadButtonProps = {
//   onUpload: ChangeEventHandler<HTMLInputElement>
//   loading: boolean
// }
// import React, { useState, useEffect, ChangeEvent } from "react";
// import { StyleSheet, View, Button } from 'react-native';
// import { Center, VStack, Text } from 'native-base';
// import { Input, Icon } from "native-base";
// // import FilePickerManager from 'react-native-file-picker';
// import ImagePicker from 'react-native-image-picker';

import React, { Fragment, Component } from 'react';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Button,
  Dimensions,
  TouchableOpacity,
  Icon,
  Box
} from 'react-native';

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';
// const options = {
//   title: 'Select Avatar',
//   customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
//   storageOptions: {
//     skipBackup: true,
//     path: 'images',
//   },
// };

// const FilePickerManager = require("NativeModules").FilePickerManager;

export default function UploadButton(props) {
    
    const {onUpload, width, height} = props;
    
    const selectImage = async () => {
    // function selectImage() {
        ImagePicker.openPicker({
          width: width,
          height: height,
          cropping: true
        }).then(image => {
          console.log(image);
          onUpload(image);
          const url = URL.createObjectURL(image.path)
          console.log(url)

        }).catch(e => {
          console.log(e);
        });

    }
    return (
        <View>
              <Button onPress={selectImage} title="Upload" color="#ea580c" accessibilityLabel="Learn more about this button"></Button>
        </View>
    )
}