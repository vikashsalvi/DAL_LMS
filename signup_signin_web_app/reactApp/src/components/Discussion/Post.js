import React, { Component } from "react";
import {Form,Container, Card,Row,Col , Button,FormControl} from "react-bootstrap";
import Axios from "axios";
import {withRouter} from "react-router-dom";

class Post extends Component {
    constructor(props){
        super(props);
        this.state  = {
            publisherMessage: "",
            messages: [],
            count: 1,
            time: {}, 
            seconds: this.props.location.state.session_seconds_left
        }
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        
        this.textInput = React.createRef();
        this.postMessage = this.postMessage.bind(this);
    }   
    componentDidMount(){
        if(this.state.count === 1){
            this.startTimer()
            this.interval = setInterval(() => this.pollSubscriber(), 6000);
            this.setState({
                count:2
            })
        }
        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({ time: timeLeftVar });
        console.log(this.props.location.state.session_name)
    }

    startTimer() {
        if (this.timer === 0 && this.state.seconds > 0) {
          this.timer = setInterval(this.countDown, 1000);
        }
      }
    
      async countDown() {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds - 1;
        this.setState({
          time: this.secondsToTime(seconds),
          seconds: seconds,
        });
        
        // Check if we're at zero.
        if (seconds === 0) { 
          clearInterval(this.timer);
          const createResources = await Axios.get("https://us-central1-rapid-rarity-278219.cloudfunctions.net/releasePubSubResources")
          alert("your session had ended")
          const removeSession = await Axios.get("https://us-central1-rapid-rarity-278219.cloudfunctions.net/removeSession")
          this.props.history.push('/discuss')
        }
      }

    secondsToTime(secs){
        let hours = Math.floor(secs / (60 * 60));
    
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
    
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
    
        let obj = {
          "h": hours,
          "m": minutes,
          "s": seconds
        };
        return obj;
      }
    async postMessage(){
        if(this.state.publisherMessage.trim() === ""){
            console.log('blank')
        }else{
            
            let msg = this.props.location.state.user_email+"~~"+this.state.publisherMessage;
            
            let data = {"message": msg,"session_name":this.props.location.state.session_name};
            
            const messagePublished  = await Axios.post("https://us-central1-rapid-rarity-278219.cloudfunctions.net/publishMessage", data)
            console.log("Published")
            console.log(messagePublished)
            /*this.setState({
                messages: this.state.messages.concat(msg)
            })
            this.textInput.current.value = ""
            this.handleChange()*/
            this.textInput.current.value = ""
        }
    }
    
    async pollSubscriber(){
        
        let email = this.props.location.state.user_email;
        email = email.split("@")[0];
        email = email.split('.').join("");
        let data = {"topic_id":"discussion_forums","subscriber_name":email};
        const messagePublished  = await Axios.post("https://us-central1-rapid-rarity-278219.cloudfunctions.net/getSubscribermessage", data)
        if(messagePublished.data.data.length === 0){
            console.log("No message received")
        }else{
            console.log(messagePublished.data.data)
            for (let i = 0; i < messagePublished.data.data.length; i++) {             
                this.setState({
                    messages: this.state.messages.concat(messagePublished.data.data[i].replace('~~',': '))
                })
           }
           this.handleChange()
        }
    }
    
    componentDidUpdate(prevProp,prevState){
        if(prevState.messages.length < this.state.messages.length){
            console.log(this.state.messages)
        }
    }
    
    handleChange() {
        this.setState({
            publisherMessage: this.textInput.current.value
        })
     }

    addCards() {
        let items = [];
        let counter = this.state.messages.length;
        if(this.state.messages.length > 0){
            for (let i = 0; i < counter; i++) {             
                items.push(
               <Card style={{height: '50px'}}>
                   <Card.Body>
                       {this.state.messages[i]}
                   </Card.Body>
               </Card>
               );
               items.push(<br />)
           }
        }
        return items;
    } 
    render(){
        return(
            
            <Container>
                <br />
                Time left for discussion session to end: 
                minutes: {this.state.time.m}, seconds: {this.state.time.s}
                <br />
              <Card style={{ height: '800px' }}>
                <Card.Body>
                <Form>
                    
                    <Card style={{ height: '100%' }}>
                        {this.addCards()}
                    </Card>
                    <br />
                    <br />
                <Row>
                <Col sm={11}>
                  <Form.Group controlId="exampleForm.ControlTextarea1">

                    <FormControl ref={this.textInput} type="text" onChange={() => this.handleChange()} />
                  </Form.Group>
                </Col>
                <Col sm={1}> 
                <Button variant="success"    
                onClick={this.postMessage.bind(this)}>Post</Button></Col>
              </Row>
              </Form>
              </Card.Body>
              </Card>
            </Container>

        );
    }
}

export default withRouter(Post);