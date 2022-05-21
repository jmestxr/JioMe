




const EventPage = () => {

    



    
    const handleSignIn = async (e) => {
      e.preventDefault()

      setLoading(true)

      // Calls `signIn` function from the context
      let { data: profiles, error } = await supabase
  .from('eventtable')
  .select('event_id,user_id')


      if (error) {
        alert('error signing in')
      } else {
        setEmail('')
        setPassword('')
        // Redirect user to Dashboard
        const pushAction = StackActions.push('Dashboard');
        navigation.dispatch(pushAction);
      }

      setLoading(false)
    }
    


    return (
        <View>
            // Some event to be displayed
        </View>
    )
}