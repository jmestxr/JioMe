import React, { useEffect, useState } from 'react'
import { supabase } from '../../../supabaseClient'
import { Image } from 'react-native';
import { background } from 'native-base/lib/typescript/theme/styled-system';
// import { DEFAULT_AVATARS_BUCKET } from '../lib/constants'

export default function Avatar({ source, size }) {
  // const [avatarUrl, setAvatarUrl] = useState("")

  // useEffect(() => {
  //   if (url) downloadImage(url)
  // }, [url])

  // async function downloadImage(path) {
  //   try {
  //     const { data, error } = await supabase.storage.from('avatars').download(path)
  //     if (error) {
  //       console.log("error here")
  //       throw error
  //     }
  //     console.log("check 1")

  //     const url = URL.createObjectURL(data)
  //     console.log("check 2")

  //     setAvatarUrl(url)
  //   } catch (error) {
  //     console.log('Error downloading image: ', error.message)
  //   }
  // }

  return <Image
        style={{ width: size, height: size }}
        resizeMode={"contain"}
        borderRadius={100}
        source={source}
      />
}