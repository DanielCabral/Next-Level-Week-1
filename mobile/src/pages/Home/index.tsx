import React,{useState, ChangeEvent, useEffect} from 'react';
import {Feather as Icon} from '@expo/vector-icons';
import {View,Image,StyleSheet, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse{
  sigla: string
}

interface IBGECityResponse{
  nome: string
}


const Home = ()=>{
  const [ufs,setUfs]= useState<string[]>([]);
  const [citys,setCitys]= useState<string[]>([]);
  const [selectedUf,setselectedUf]=useState('0');
  const [selectedCity,setselectedCity]=useState('0');
  const navigation = useNavigation();

  function handleNavigationToPoints(){
    if(selectedUf !== '0' && selectedCity !== '0'){
      navigation.navigate('Points',{
        selectedUf,
        selectedCity
      });
    }
  }

  useEffect(()=>{
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
     .then(response=>{
         const ufsInitial= response.data.map(uf=> uf.sigla);
         setUfs(ufsInitial);
     });
 },[]);

 useEffect(()=>{
     if(selectedUf==='0')
         return;
     axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response=>{
          const citysInitials= response.data.map(city=> city.nome);
          setCitys(citysInitials);
      });
  },[selectedUf]);

  function handleSelectedUf(value : string){
     const uf=value;

     setselectedUf(uf);
  }

  function handleSelectedCity(value: string){
     const city= value;

     setselectedCity(city);
  }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex : 1 }}>
        <ImageBackground source={require('../../../assets/home-background.png')} style={styles.container} imageStyle={{width: 274, height: 368}}>
            <View style={styles.main}>
                <Image source={require('../../../assets/logo.png')}/>
                <Text style={styles.title}>Seu marktplace de coleta de residuos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
            </View>
            <View style={styles.footer}>
              <RNPickerSelect
                placeholder={{label: 'Digite a UF'}}
                onValueChange={(itemValue) => {
                  handleSelectedUf(itemValue);
                }}
                items={ufs.map((uf)=> ({label: uf,value: uf, key: uf}))}
              />
              <RNPickerSelect
                placeholder={{label: 'Digite a Cidade'}}
                onValueChange={(itemValue) => {
                  handleSelectedCity(itemValue);
                }}
                items={citys.map((city)=> ({label: city,value: city, key: city}))}
              />
                <RectButton style={styles.button} onPress={handleNavigationToPoints}>
                    <View style={styles.buttonIcon}>
                           <Text>
                            <Icon name='arrow-right' color='#fff' size={24}/>
                           </Text>
                    </View>
                    <Text style={styles.buttonText}>
                      Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      backgroundColor: '#f0f0f5',
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      paddingRight: 25,
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });
export default Home;