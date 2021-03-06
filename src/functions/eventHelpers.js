import Toast from 'react-native-toast-message';
import {supabase} from '../../supabaseClient';
import {getLocalDateTimeNow} from './helpers';

export const handleLikeEvent = async (userId, eventId) => {
  try {
    const {data, error} = await supabase
      .from('user_likedevents')
      .insert([{user_id: userId, event_id: eventId}]);
    if (error) throw error;
    if (data) {
      Toast.show({
        type: 'success',
        text1: 'Added event to Wishlist.'
      });
      return data;
    }
  } catch (error) {
    console.log(error);
    Toast.show({
      type: 'error',
      text1: 'Error encountered in adding event to Wishlist. Please try again later.'
    });
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
      Toast.show({
        type: 'success',
        text1: 'Removed event from Wishlist.'
      });
      return data;
    }
  } catch (error) {
    console.log(error);
    Toast.show({
      type: 'error',
      text1: 'Error encountered in removing event from Wishlist. Please try again later.'
    });
  }
};

export const getEventDetails = async (eventId) => {
  try {
    const {data, error} = await supabase
      .from('events')
      .select(
        `
        *,
        profiles!events_organiser_id_fkey (
          *
        )
      `,
      )
      .eq('id', eventId)
      .single();
    if (error) throw error;
    if (data) return data;
  } catch (error) {
    console.log(error)
  }
};

export const getEventCurrCapacity = async eventId => {
  try {
    const {data, count, error} = await supabase
      .from('user_joinedevents')
      .select('user_id, event_id', {count: 'exact'})
      .eq('event_id', eventId);
    if (error) throw error;
    if (data) return count;
  } catch (error) {
    console.log(error.error_description || error.message);
  }
};

export const handleJoinEvent = async (userId, eventId) => {
  hasJoinedEvent(userId, eventId).then(result => {
    if (result > 0) {
      Toast.show({
        type: 'error',
        text1: 'You have already joined this event.'
      });
    } else {
      eventIsOver(eventId).then(result => {
        if (result > 0) {
          Toast.show({
            type: 'error',
            text1: 'This event is already over. Sorry!'
          });
        } else {
          getEventCurrCapacity(eventId)
            .then(currCap => eventIsFull(eventId, currCap))
            .then(result => {
              if (result > 0) {
                Toast.show({
                  type: 'error',
                  text1: 'This event has reached full capacity. Sorry!'
                });
              } else {
                joinEvent(userId, eventId)
              }
            });
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
      Toast.show({
        type: 'success',
        text1: 'You have quit this event.'
      });
    }
  } catch (error) {
    console.log(error);
    Toast.show({
      type: 'error',
      text1: 'Error encountered in joining event. Please try again later.'
    });
  }
};

export const handleDeleteEvent = async (eventId) => {
  try {
    const {data, error} = await supabase
      .from('events')
      .delete()
      .match({id: eventId});
    if (error) throw error;
    else {
      Toast.show({
        type: 'success',
        text1: 'Event is deleted'
      });
    }
  } catch (error) {
    console.log(error);
    Toast.show({
      type: 'error',
      text1: 'Error encountered in deleting event. Please try again later.'
    });
  }
};

// HELPER FUNCTIONS

// function returns count = 1 if user has already joined/is organising event; else return 0
export const hasJoinedEvent = async (userId, eventId) => {
  return Promise.all([
    isParticipant(userId, eventId),
    isOrganiser(userId, eventId),
  ]).then(results => results[0] + results[1]);
};

// function returns count = 1 if user is participant; else return 0
const isParticipant = async (userId, eventId) => {
  try {
    const {data, count, error} = await supabase
      .from('user_joinedevents')
      .select('user_id, event_id', {count: 'exact'})
      .match({user_id: userId, event_id: eventId});
    if (error) throw error;
    if (data) return count;
  } catch (error) {
    console.log(error);
  }
};

// function returns count = 1 if user is organiser; else return 0
export const isOrganiser = async (userId, eventId) => {
  try {
    const {data, count, error} = await supabase
      .from('events')
      .select('id, organiser_id', {count: 'exact'})
      .match({organiser_id: userId, id: eventId});
    if (error) throw error;
    if (data) return count;
  } catch (error) {
    console.log(error);
  }
};

// function returns count = 1 if event is over; else return 0
export const eventIsOver = async eventId => {
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

// function returns count = 1 if event is full; else return 0
export const eventIsFull = async (eventId, currCapacity) => {
  try {
    const {data, count, error} = await supabase
      .from('events')
      .select('id, max_capacity', {count: 'exact'})
      .eq('id', eventId)
      .lte('max_capacity', currCapacity);
    if (error) throw error;
    if (data) return count;
  } catch (error) {
    console.log(error);
  }
};

const joinEvent = async (userId, eventId) => {
  try {
    const {data, error} = await supabase
      .from('user_joinedevents')
      .insert([{user_id: userId, event_id: eventId}]);
    if (error) throw error;
    if (data) {
      Toast.show({
        type: 'success',
        text1: 'You have joined this event.'
      });
      return data;
    }
  } catch (error) {
    console.log(error.error_description || error.message);
  }
};
