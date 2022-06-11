import {supabase} from '../../supabaseClient';

export const handleLikeEvent = async (userId, eventId) => {
  try {
    const {data, error} = await supabase
      .from('user_likedevents')
      .insert([{user_id: userId, event_id: eventId}]);
    if (error) throw error;
    if (data) {
      alert('Added event to wishlist.');
      return data;
    }
  } catch (error) {
    console.log(error.error_description || error.message);
  }
};

export const handleUnlikeEvent = async (userId, eventId) => {
  try {
    const {data, error} = await supabase
      .from('user_likedevents')
      .delete()
      .match({user_id: userId, event_id: eventId});
    if (error) throw error;
    if (data) {
      alert('Removed event from wishlist.');
      return data;
    }
  } catch (error) {
    console.log(error.error_description || error.message);
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
    console.log(error.error_description || error.message);
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
    console.log(error.error_description || error.message);
  }
};

export const handleJoinEvent = async (userId, eventId) => {
  checkIfJoinedEventAlready(userId, eventId).then(value => {
    if (value > 0) {
      alert('You have already joined this event.');
    } else {
      joinEvent(userId, eventId);
      alert('You have joined this event.');
    }
  })
};

export const handleQuitEvent = async (userId, eventId) => {
  try {
    const {data, error} = await supabase
      .from('user_joinedevents')
      .delete()
      .match({user_id: userId, event_id: eventId});
    if (error) throw error;
    if (data) {
      alert('You have quitted this event.')
    }
  } catch (error) {
    console.log(error.error_description || error.message);
  }
};


// helper functions
const checkIfJoinedEventAlready = async (userId, eventId) => {
  try {
    const { data, count, error } = await supabase
      .from('user_joinedevents')
      .select('user_id, event_id', {count: 'exact'})
      .match({user_id: userId, event_id: eventId});

    if (error) throw error;
    if (data) return count;
  } catch (error) {
    console.log(error.error_description || error.message)
  }
}

const joinEvent = async (userId, eventId) => {
  try {
    const {data, error} = await supabase
      .from('user_joinedevents')
      .insert([{user_id: userId, event_id: eventId}]);
    if (error) throw error;
    if (data) return data;
  } catch (error) {
    console.log(error.error_description || error.message)
  }
}

/* TODO: 
    handleDeleteEvent(organiserId, eventId) 
    
    * abstract common
*/
