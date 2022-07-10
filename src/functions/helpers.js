import {supabase} from '../../supabaseClient';

export const getLocalDateTimeNow = () => {
  return new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000,
  ).toISOString();
};

export const getLocalDateTime = date => {
  return new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  ).toISOString();
};

// function returns public url of picture given its private url (from supabase)
export const getPublicURL = (privateURL, bucketName) => {
  try {
    if (privateURL == '') return {uri: ''};
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

// function returns profile details (username, avatar_url, etc) of user given its id
export const getProfileDetails = async userId => {
  try {
    const {data, error} = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (data) return data;
  } catch (error) {
    console.log('error', error.message);
  }
};
