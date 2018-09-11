import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  // addTrack
  // Description:
  //  Accept a track argument. Use the track's id property to check if thecurrent
  //  song is in the playlistTracks state. If the id is new, add the song to the end
  //  of the playlist. Set the new state of the playlist.
  addTrack(track){
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    let newList = this.state.playlistTracks.slice();
    newList.push(track);
    this.setState({playlistTracks: newList});
  }
  // removeTrack
  // Description:
  //  Accept a track argument. Use the track's id property to filter it out of
  //  playlistTracks. Set the new state of the playlist.
  removeTrack(track){
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      let newList = this.state.playlistTracks.filter(
        removeTrack => removeTrack.id !== track.id
      );
      this.setState({playlistTracks: newList});
    }
    return;
  }
  // updatePlaylistName
  // Description:
  //  Accept a name argument. Set the state of the playlist name to the input
  //  argument.
  updatePlaylistName(name){
    this.setState({playlistName: name});
  }
  // savePlaylist
  // Description:
  //  Generate an array of uri values called trackURIs from the playlistTracks
  //  property. Pass the track URIs array and playlistName to Spotify utility
  //  to save the user's playlist to their account.
  savePlaylist(){
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({
      playlistName: "New Playlist",
      playlistTracks: []
    });
  }
  // search
  // Description:
  //  Accept a search term and query the Spotify API using the input search term.
  search(searchTerm){
    Spotify.search(searchTerm).then(searchResults =>
      this.setState({searchResults: searchResults})
    );
  }

  render() {
    console.log(this.state.searchResults);
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}/>
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
