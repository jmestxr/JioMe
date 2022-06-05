import { supabase } from "../../supabaseClient";

export const handleLikeEvent = async (userId, eventId) => {
    try {
        const { data, error } = await supabase
            .rpc('add_array_record', 
                    { _table:'profiles', 
                        _id_column:'id', 
                        _target_column:'liked_events', 
                        row_id:userId, 
                        record:eventId })
        if (error) throw error
        if (data) return data;
    }
    catch (error) {
        alert(error.error_description || error.message)
    }
}

export const handleUnlikeEvent = async (userId, eventId) => {
    try {
        const { data, error } = await supabase
            .rpc('delete_array_record', 
                    { _table:'profiles', 
                        _id_column:'id', 
                        _target_column:'liked_events', 
                        row_id:userId, 
                        record:eventId })
        if (error) throw error
        if (data) return data;
    }
    catch (error) {
        alert(error.error_description || error.message)
    }
}


/* TODO: 
    handleJoinEvent(participantId, eventId)
    handleQuitEvent(participantId, eventId) 
    handleDeleteEvent(organiserId, eventId) 
*/