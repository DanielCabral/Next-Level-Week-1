import React,{useState,useEffect, ChangeEvent, FormEvent} from 'react';  
import {Link, useHistory} from 'react-router-dom';
import  { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import  { LeafletMouseEvent} from 'leaflet';

import api from '../../services/api';
import axios from 'axios';
import logo from '../../assets/logo.svg';
import './styles.css';

import {FiArrowLeft} from 'react-icons/fi';


interface Item{
    id: number,
    title: string,
    image_url: string
}

interface IBGEUFResponse{
    sigla: string
}

interface IBGECityResponse{
    nome: string
}



const CreatePoint= () => {
    const [items,setItems]= useState<Item[]>([]);
    const [ufs,setUfs]= useState<string[]>([]);
    const [citys,setCitys]= useState<string[]>([]);
    const [selectUf,setselectedUf]=useState('0');
    const [selectCity,setselectedCity]=useState('0');
    const [initialPosition,setInicialPosition]=useState<[number,number]>([0, 0]);
    const [selectPosition,setselectedPosition]=useState<[number,number]>([0, 0]);
    const [selectedItems,setSelectedItems]=useState<number[]>([]);
    const [formData,setFormData]= useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    const history=useHistory();

    
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(position=>{
            const {latitude,longitude} =position.coords;
            setInicialPosition([latitude,longitude]);
        })
    },[]);
    useEffect(()=>{
        api.get('items')
        .then(response=>{
            console.log(response.data);
            setItems(response.data);
        });
    },[]);

    useEffect(()=>{
       axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response=>{
            const ufsInitial= response.data.map(uf=> uf.sigla);
            setUfs(ufsInitial);
        });
    },[]);

    useEffect(()=>{
        if(selectUf==='0')
            return;
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectUf}/municipios`)
         .then(response=>{
             const citysInitials= response.data.map(city=> city.nome);
             setCitys(citysInitials);
         });
     },[selectUf]);

     function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>){
        const uf=event.target.value;

        setselectedUf(uf);
     }

     function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>){
        const city=event.target.value;

        setselectedUf(city);
     }

     function handleMapClick(event : LeafletMouseEvent){
        const latidude=event.latlng.lat;
        const longitude=event.latlng.lng;
        setselectedPosition([latidude, longitude]);
        console.log(selectPosition);
     }

     function handleInputChange(event : ChangeEvent<HTMLInputElement>){
         const {name,value} = event.target;
         setFormData({ ...formData, [name]: value})
     }

     function handleSelectItem(id: number){
         const alreadySelected=selectedItems.findIndex(item => item === id);
         if(alreadySelected >= 0){
            const filteredItems=selectedItems.filter(item => item!=id);
            setSelectedItems(filteredItems);
         }else{
            setSelectedItems([...selectedItems, id]);
         }
     }

     async function handleSubmit(event : FormEvent){
        event.preventDefault();

        const {name, email, whatsapp}=formData;
        const uf=selectUf;
        const city=selectCity;
        const [latitude,longitude]=selectPosition;
        const items=selectedItems;
        const data={
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items,
        };
        await api.post('/points',data)

        history.push('/');
     }
    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to=''>
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do<br/> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input type="text" name="name" id="name" onChange={handleInputChange}/>
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" name="email" id="email" onChange={handleInputChange}/>
                        </div>
                        <div className="field">
                            <label htmlFor="name">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange}/>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                //1:53:13

                    <Map center={[-5.5873814,-36.9374359]} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectPosition}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select name="uf" id="uf" value={selectUf} onChange={handleSelectedUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map((uf,i) => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectCity} onChange={handleSelectedCity}>
                                {citys.map((city,i) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id} className={selectedItems.includes(item.id) ? "selected" : ""} onClick={() => handleSelectItem(item.id)}>
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>
                <button type="submit">Cadastrar Ponto de Coleta</button>
            </form>
        </div>
    );
}
export default CreatePoint;