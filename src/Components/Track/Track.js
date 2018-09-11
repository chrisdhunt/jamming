import React, { Component } from 'react';
import './Track.css';

class Track extends Component {
  constructor(props){
    super(props);

    this.renderAction = this.renderAction.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.displayPreview = this.displayPreview.bind(this);
  }

  renderAction(){
    if(this.props.isRemoval){
      return (<a className="track-action" onClick={this.removeTrack}>-</a>);
    }
    return (<a className="track-action" onClick={this.addTrack}>+</a>);
  }
  addTrack(){
    this.props.onAdd(this.props.track);
  }
  removeTrack(){
    this.props.onRemove(this.props.track);
  }
  displayPreview(){
    if(this.props.track.preview_url){
      return (
        <p>
          <audio controls>
            <source src={this.props.track.preview_url} type="audio/mp3" />
            Your browser does not support HTML5 audio.
          </audio>
        </p>);
    }
    return (<p>No preview available</p>);
  }

  render() {
    return (
      <div className="track">
        <div className="track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
          {this.displayPreview()}
        </div>
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;
