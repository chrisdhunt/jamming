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
      searchResults: [
        // {name: "a", artist: "b", album: "c", id: "1"},
        // {name: "d", artist: "e", album: "f", id: "2"},
        // {name: "h", artist: "i", album: "j", id: "3"}
      ],
      playlistName: "My Favorite Songs",
      playlistTracks: [
        // {name: "x", artist: "y", album: "z", id: "5"},
        // {name: "q", artist: "r", album: "s", id: "6"},
        // {name: "t", artist: "u", album: "v", id: "7"}
      ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    let newList = this.state.playlistTracks.slice();
    newList.push(track);
    this.setState({playlistTracks: newList});
  }
  removeTrack(track){
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      let newList = this.state.playlistTracks.filter(removeTrack => removeTrack.id !== track.id);
      this.setState({playlistTracks: newList});
    }
    return;
  }
  updatePlaylistName(name){
    this.setState({playlistName: name});
  }
  savePlaylist(){
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({
      playlistName: "New Playlist",
      playlistTracks: []
    });
  }
  // search function
  //  1. Accepts search term
  //  2. Logs the term to the console
  search(searchTerm){
    console.log("Here is what I'm searching for: " + searchTerm);
    Spotify.search(searchTerm).then(searchResults => this.setState({searchResults: searchResults}));
  }

  render() {
    console.log(this.state.searchResults);
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
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
