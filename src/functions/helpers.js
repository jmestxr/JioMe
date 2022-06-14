import { supabase } from "../../supabaseClient";

export const getLocalDateTimeNow = () => {
  return new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000,
  ).toISOString();
};

export const getLocalDateTime = (date) => {
  return new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  ).toISOString();
};


// function returns public url of picture given its private url (from supabase)
export const getPublicURL = (privateURL, bucketName) => {
  try {
    const {publicURL, error} = supabase.storage
      .from(bucketName)
      .getPublicUrl(privateURL);
    if (error) throw error;
    if (publicURL) {
      return {uri: publicURL};
    }
  } catch (error) {
    console.log(error.error_description || error.message);
  }
};
