let accessToken = '';
let expireIn = '';
const authEndpoint = 'https://accounts.spotify.com/authorize?';
const clientID = '84c9c6b2b727472fa57d92af0fc8ee34';
// const redirectURI = "http://localhost:3000/";
const redirectURI = "https://chrisdhunt.surge.sh";

const Spotify = {
  getAccessToken(){
    if( accessToken ) {
      console.log("Just returning access token");
      return accessToken;
    } else if ( window.location.href.match(/access_token=([^&]*)/) &&
                window.location.href.match(/expires_in=([^&]*)/)) {
      console.log("Parsing the current URL");
      const accessTokenParse = window.location.href.match(/access_token=([^&]*)/);
      accessToken = accessTokenParse[1];
      const expiresInParse = window.location.href.match(/expires_in=([^&]*)/);
      expireIn = expiresInParse[1];
      console.log(accessToken);
      console.log(expireIn);
      console.log(window.location.href);

      // Wipe the access token and URL params
      window.setTimeout(() => accessToken = '', expireIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      console.log("Getting new URL");
      const targetURL = `${authEndpoint}client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = targetURL;
    }
  },
  search( searchTerm ){
    const currentAccessToken = this.getAccessToken();
    console.log("Current access token: "+currentAccessToken);
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
      {headers: {Authorization: `Bearer ${currentAccessToken}`}}
    ).then(
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
        } else {
          return [];
        }
      }
    );
  },
  savePlaylist(playlistName, trackURIs){
    const currentAccessToken = this.getAccessToken();
    const headers = {Authorization: `Bearer ${currentAccessToken}`};
    let userID = '';
    let playlistID = '';

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
            {headers: headers, method: 'POST', body: JSON.stringify({name: playlistName})}
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
              {headers: headers, method: 'POST', body: JSON.stringify({uris: trackURIs})});
            }
          );
        }
      }
    );
  }
};

export default Spotify;
