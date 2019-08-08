import React,{useState} from 'react';
import Connect from "./connect"


function App() {
  const [name,Setname] = useState("")
  const [email,setEmail] = useState("")
  const [puh,setPuh] = useState("")
  const [teskti,setTeksti] = useState("")


  const sendData = (event) =>{
    event.preventDefault()
    console.log(name)
    console.log(puh)
    console.log(email)
    console.log(teskti)
    const data = {
      name: name,
      id: puh,
      email: email,
      text: teskti
    }
    Connect.create(data).then(data => {
      console.log(data.status)
      if(data.status === 200){
        window.open("http://localhost:3001/dowload/second.pdf")
      }else{
        console.log("error")
      }
    })
    
  }
  
  return (
    <div className="App">
      <h1>Syötä tiedot, jotta voit generoida pdf:n</h1>
      <form onSubmit={sendData} >
          Name:<input type="text" name="name" onChange={({target}) => Setname(target.value)}/>
          <br/>
          <br/>
          puh: <input type="text" name="name" onChange={({target}) => setPuh(target.value)}/>
          <br/>
          <br/>
          email: <input type="text" name="name" onChange={({target}) => setEmail(target.value)}/>
          <br/>
          <br/>
          Tietoa<textarea  onChange={({target}) => setTeksti(target.value)}/>
          <br/>
          <br/>
        <input type="submit" value="Submit" />
      </form>
      
    </div>
  );
}

export default App;
