import React, { Component } from "react";
import "./App.css";
import axios from 'axios';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      message : null
    };
  
  }
  
  processFile(){
    window.location.assign("https://wordcloud-y6r2d6i6oa-uk.a.run.app");
 }

 analyseFile(){
  window.location.assign("https://analysefile-y6r2d6i6oa-uk.a.run.app");
}

  tagJson = () => {
    axios.get("https://us-central1-serverless-project-283900.cloudfunctions.net/ingestChat")
    .then((response) => {
      if (response.data.message === "OK"){
        return axios.get("https://so0wlri1tb.execute-api.us-east-1.amazonaws.com/tagjson/")
      }else{
        this.setState({message: "Error in tagging json files try again in sometimes."})
      }
    })
    .then((res)=>{
      this.setState({message: res.data.body})
    })
  }

  render(){
    return (
      <div className="button_container">
      <button type="submit" className="button" onClick={this.processFile.bind(this)}>Go to Process Data page</button>
      <br/>
      <br />
      <br />
      <button type="submit" className="button" onClick={this.analyseFile.bind(this)}>Go to Analyse Data page</button>
      <br/>
      <br />
      <br />
      <button type="submit" className="button" onClick={this.tagJson.bind(this)}>Tag chat Json</button>
      <h4>{this.state.message}</h4>
      </div>
    )

  }
}

export default App;
