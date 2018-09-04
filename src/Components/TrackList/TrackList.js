import React, { Component } from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends Component {
  render() {
    console.log(this.props.tracks);
    return (
      <div className="TrackList">
        {
          this.props.tracks.map(track => {
            return (
              <Track
                track={track}
                key={track.id}
                onAdd={this.props.onAdd}
                onRemove={this.props.onRemove}
                isRemoval={this.props.isRemoval}/>
            );
          })
          // <Track track={this.props.tracks[0]} key={this.props.tracks[0].id} />
        }
      </div>
    );
  }
}

export default TrackList;
