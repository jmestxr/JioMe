import React, { useEffect, useState } from 'react'
import { supabase } from '../../../supabaseClient'
import { Image } from 'react-native';
import { background } from 'native-base/lib/typescript/theme/styled-system';
// import { DEFAULT_AVATARS_BUCKET } from '../lib/constants'

export default function EventPictureFormat({ source, height, width }) {

  return <Image
        style={{ width: width, height: height }}
        resizeMode={"contain"}
        // borderRadius={100}
        source={source}
      />
}