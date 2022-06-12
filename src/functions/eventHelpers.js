import {supabase} from '../../supabaseClient';
import {getLocalDateTimeNow} from './helpers';

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
      .eq('user_joinedevents.event_id', eventId);
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
  } catch (error) {
    console.log(error.error_description || error.message);
  }
};

export const handleJoinEvent = async (userId, eventId) => {
  hasJoinedEvent(userId, eventId).then(value => {
    if (value > 0) {
      alert('You have already joined this event.');
    } else {
      eventIsOver(eventId).then(value => {
        if (value > 0) {
          alert('This event is already over. Sorry!');
        } else {
          joinEvent(userId, eventId);
        }
      });
    }
  });
};

export const handleQuitEvent = async (userId, eventId) => {
  try {
    const {data, error} = await supabase
      .from('user_joinedevents')
      .delete()
      .match({user_id: userId, event_id: eventId});
    if (error) throw error;
    if (data) {
      alert('You have quitted this event.');
    }
  } catch (error) {
    console.log(error.error_description || error.message);
  }
};

// HELPER FUNCTIONS

const hasJoinedEvent = async (userId, eventId) => {
  try {
    const {data, count, error} = await supabase
      .from('user_joinedevents')
      .select('user_id, event_id', {count: 'exact'})
      .match({user_id: userId, event_id: eventId});

    if (error) throw error;
    if (data) return count;
  } catch (error) {
    console.log(error.error_description || error.message);
  }
};

// function returns count = 1 if event is over; else return 0
const eventIsOver = async eventId => {
  try {
    const {data, count, error} = await supabase
      .from('events')
      .select('id, to_datetime', {count: 'exact'})
      .eq('id', eventId)
      .lt('to_datetime', getLocalDateTimeNow());
    if (error) throw error;
    if (data) return count;
  } catch (error) {
    console.log(error.error_description || error.message);
  }
};

const joinEvent = async (userId, eventId) => {
  try {
    const {data, error} = await supabase
      .from('user_joinedevents')
      .insert([{user_id: userId, event_id: eventId}]);
    if (error) throw error;
    if (data) return data;
  } catch (error) {
    console.log(error.error_description || error.message);
  }
};

/* TODO: 
    handleDeleteEvent(organiserId, eventId) 
    
    * abstract common
*/
