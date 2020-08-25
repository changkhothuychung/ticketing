import buildClient from '../api/build-client';
import axios from 'axios'
const LandingPage = ({currentUser}) => {
    // console.log("on the component", color); 

    console.log(currentUser); 
    return currentUser ? <h1> You are signed in </h1> : <h1> You are not signed in </h1>
}


LandingPage.getInitialProps = async ({ req }) => {
   
//    const response = await axios.get('/api/users/currentuser'); 
//    return response.data;
    if(typeof window === 'undefined'){
        const {data} = await axios.get(
            'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
                headers: req.headers
            }
        )
        return data; 
    }
    else{
        const {data} = await axios.get('/api/users/currentuser'); 
        return data;
    }
    console.log('I WAS EXECUTED'); 
    return {};
}

export default LandingPage; 
