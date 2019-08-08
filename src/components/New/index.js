import React, { Component } from 'react';
import { Link, withRouter} from 'react-router-dom';
import firebase from '../../firebase';
import './new.css';

class New extends Component {

    constructor(props){
        super(props);
        this.state = {
            titulo: '',
            imagem: null,
            url: '',
            descricao: '',
            alert: '',
            progress: 0
        }
        this.cadastrar = this.cadastrar.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    componentDidMount(){
        if(!firebase.getCurrent()){
            this.props.history.replace('/');
            return null;
        }
        // alert(firebase.getUid());
    }

    handleFile = async (e)=> {
        e.preventDefault();
        if(e.target.files[0]){
            const image = e.target.files[0];

            if(image.type === 'image/png' || image.type === 'image/jpeg'){
                console.log(image);
                await this.setState({imagem: image});
                this.handleUpload();

            }else {
                alert('Envie imagem no formato JPEG ou PNG');
                this.setState({imagem: null});
                return null;
            }
            
        }
        
    }

    handleUpload = async () =>{
        console.log(this.state.imagem);
        const {imagem} = this.state;
        const currentUid = firebase.getUid();
        const uploadTaks = firebase.storage.ref(`images/${currentUid}/${imagem.name}`).put(imagem);

        await uploadTaks.on('state_changed', 
        (snapshot)=>{
            //progress
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            this.setState({progress});
        },
        (error)=>{
            console.log('Error image: '+ error);
        },
        ()=>{
            //success
            firebase.storage.ref(`images/${currentUid}`)
            .child(imagem.name).getDownloadURL()
            .then(url => {this.setState({url: url})})
        }
        
        )
    }

    cadastrar = async(e) => {
        e.preventDefault();

        if(this.state.titulo !== '' && this.state.imagem !== '' && this.state.descricao !== '' && this.state.url !== '' && this.state.imagem !== null  ){
          let posts =  firebase.app.ref('posts');
          let chave = posts.push().key;
          await posts.child(chave).set({
              titulo: this.state.titulo,
              image: this.state.url,
              descricao: this.state.descricao,
              autor: localStorage.nome
              
          });
          this.props.history.push('/dashboard');

        }else {
            this.setState({alert: 'Preencha todos os campos'});
        }
    }

    render() {
        return (
            <div>
                <header id="new"><Link to="/dashboard">Voltar</Link></header>
                
                <form onSubmit={this.cadastrar} id="newpost">
                    <label>Titulo: </label>
                    <input type="text" placeholder="Nome do post" value={this.state.titulo} onChange={(e)=> this.setState({titulo: e.target.value})}/>

                    <input type="file"  onChange={this.handleFile}/>
                    {this.state.url !== '' ?
                    <img src={this.state.url} width="250" height="150" alt="capa do post" /> 
                    :
                    <progress value={this.state.progress} max="100"/>
                    }

                    <label>Descrição: </label>
                    <textarea type="text" placeholder="Descrição" value={this.state.descricao} onChange={(e)=> this.setState({descricao: e.target.value})}/>

                    <button type="submit" >Cadastrar</button>
                    <span style={{color: "red"}}>{this.state.alert}</span>
                </form>
            </div>
        );
    }
}

export default withRouter(New);