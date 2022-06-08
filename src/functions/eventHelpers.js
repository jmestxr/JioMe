import {supabase} from '../../supabaseClient';

export const handleLikeEvent = async (userId, eventId) => {
  try {
    const {data, error} = await supabase
      .from('user_likedevents')
      .insert([{user_id: userId, event_id: eventId}]);
    if (error) throw error;
    if (data) return data;
  } catch (error) {
    alert(error.error_description || error.message);
  }
};

export const handleUnlikeEvent = async (userId, eventId) => {
  try {
    const {data, error} = await supabase
      .from('user_likedevents')
      .delete()
      .match({user_id: userId, event_id: eventId});
    if (error) throw error;
    if (data) return data;
  } catch (error) {
    alert(error.error_description || error.message);
  }
};

export const getEventCurrCapacity = async eventId => {
  try {
    const {data, count, error} = await supabase
      .from('user_joinedevents')
      .select('user_id, event_id', {count: 'exact'})
      .eq({event_id: eventId});
    if (error) throw error;
    if (data) return count;
  } catch (error) {
    alert(error.error_description || error.message);
  }
};

// function returns object (URL) of event picture
export const getEventPicture = privateURL => {
  try {
    const {publicURL, error} = supabase.storage
      .from('eventpics')
      .getPublicUrl(privateURL);
    if (error) throw error;
    if (publicURL) {
      return {uri: publicURL};
    }
  } catch {
    alert(error.error_description || error.message);
    return {uri: '../assets/logo.png'};
  }
};

/* TODO: 
    handleJoinEvent(participantId, eventId)
    handleQuitEvent(participantId, eventId) 
    handleDeleteEvent(organiserId, eventId) 
    
    * abstract common
*/
