let accessToken = '';
let expireIn = '';
const authEndpoint = 'https://accounts.spotify.com/authorize?';
const clientID = '84c9c6b2b727472fa57d92af0fc8ee34';
const redirectURI = "http://chrisdhunt.surge.sh";

const Spotify = {
  // getAccessToken
  // Dsecription:
  //  Retrieve the currently set accessToken to use in Spotify API authorization
  //  headers. If we don't have one, we need to parse it it from current URl or
  //  Build and query a new authorize endpoint.
  getAccessToken(){
    if( accessToken ) {
      // We already have an access token, so just return it
      return accessToken;
    } else if ( window.location.href.match(/access_token=([^&]*)/) &&
                window.location.href.match(/expires_in=([^&]*)/)) {
      // The current window has the URL and needs to parse access token
      const accessTokenParse = window.location.href.match(/access_token=([^&]*)/);
      accessToken = accessTokenParse[1];
      const expiresInParse = window.location.href.match(/expires_in=([^&]*)/);
      expireIn = expiresInParse[1];

      // Wipe the access token and URL params
      window.setTimeout(() => accessToken = '', expireIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      // The current window doesn't have the correct URL, so let's build it.
      const targetURL = `${authEndpoint}client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = targetURL;
    }
  },
  // search
  // Description:
  //  Use an access token to send a search term to the Spotify API and return an
  //  array of track information for each result returned.
  search( searchTerm ){
    const currentAccessToken = this.getAccessToken();
    console.log("Current access token: "+currentAccessToken);
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
      {headers: {Authorization: `Bearer ${currentAccessToken}`}}
    ).then( // Convert the return object to JSON for easier manipulation
      response => {return response.json();}
    ).then(
      jsonResponse => {
        if (jsonResponse.tracks){
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));
        } else { // If no track object exists, return an empty array.
          return [];
        }
      }
    );
  },
  // savePlaylist
  // Description:
  //  Use an access token to save an array of track URIs to a playlist on the
  //  user's Spotify account with the given input name.
  savePlaylist(playlistName, trackURIs){
    const currentAccessToken = this.getAccessToken();
    const headers = {Authorization: `Bearer ${currentAccessToken}`};
    let userID = '';
    let playlistID = '';

    // Get the userID first so we know the endpoint to update
    fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(
      response => {
        if (response.ok) {
          return response.json();
        } throw new Error ('Request failed!');
      }, networkError => {console.log(networkError.message);}
    ).then(
      jsonResponse => {
        if (jsonResponse.id){
          userID = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
            {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({name: playlistName})
            }
          ).then(
            response => {
              if(response.ok){
                return response.json();
              } throw new Error ('Request failed!');
            }, networkError => {console.log(networkError.message);}
          ).then(
            jsonResponse => {
              playlistID = jsonResponse.id;
              return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,
                {
                  headers: headers,
                  method: 'POST',
                  body: JSON.stringify({uris: trackURIs})
                }
              );
            }
          );
        }
      }
    );
  }
};

export default Spotify;
