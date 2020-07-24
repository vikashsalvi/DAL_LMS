import React, { Component } from "react";
import {Form,Container, Card,Row,Col , Button,FormControl} from "react-bootstrap";
import Axios from "axios";

class Post extends Component {

    constructor(props){
        super(props);
        this.state  = {
            publisherMessage: "",
            messages: []
        }
        this.textInput = React.createRef();
        this.postMessage = this.postMessage.bind(this);

    }
    async postMessage(){
        if(this.state.publisherMessage.trim() === ""){
            console.log('blank')
        }else{
            
            let msg = "user1~~"+this.state.publisherMessage;

            const data = {"message": msg};
            const headers = { 
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/json',
                'Access-Control-Allow-Credentials': 'true'
            };
            await Axios.post('https://us-central1-rapid-rarity-278219.cloudfunctions.net/publisher', data, { headers })
                .then(response => console.log(response));
                
            //const messagePublished  = await Axios.post("https://us-central1-rapid-rarity-278219.cloudfunctions.net/publisher", )
            console.log("Published")
            this.setState({
                messages: this.state.messages.concat(msg)
            })
            this.textInput.current.value = ""
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

export default Post;
