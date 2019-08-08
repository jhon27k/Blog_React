import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import firebase from '../../firebase';
import { async } from 'q';


class Register extends Component {

    constructor(props){
        super(props);
        this.state = {
            nome: '',
            email:'',
            password: ''
        };

        this.register = this.register.bind(this);
        this.onRegister = this.onRegister.bind(this);

    }

    componentDidMount(){
        // se tem usuario logado 
        // if(firebase.getCurrent()){
        //     return this.props.history.replace('dashboard');
        // }
    }

    register(e){
        e.preventDefault();
        this.onRegister();
       
    }

    onRegister = async() => {
        try {
            const {nome, email, password} = this.state;
            await firebase.register(nome, email, password);
            this.props.history.replace('/dashboard');
        } catch (error) {
            alert(error.message);
        }
    }


    render() {
        return (
            <div>
                <form onSubmit={this.register} id="login">
                <label>Nome: </label>
                    <input type="text" autoComplete="off" autoFocus value={this.state.nome}
                    onChange={(e) => this.setState({nome: e.target.value})} placeholder="nome"/><br/>

                    <label>Email: </label>
                    <input type="email" autoComplete="off" value={this.state.email}
                    onChange={(e) => this.setState({email: e.target.value})} placeholder="teste@teste"/><br/>

                    <label>Password: </label>
                    <input type="password" autoComplete="off" value={this.state.password}
                    onChange={(e) => this.setState({password: e.target.value})} placeholder="password"  /><br/>

                    <button type="submit" >Entrar</button>
                </form>
            </div>
        );
    }
}

export default withRouter(Register);