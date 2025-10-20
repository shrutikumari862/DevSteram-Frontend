import { useState } from 'react';
import logo from '../../assets/logo.png'
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    
// const borderColor='#527DF3';
// const bordershadowcolor=shadow-[0_0_30px_5px_rgba(59,130,246,0.7)]
const navigate=useNavigate()
const [id,setId]=useState("")
const [userName,setUserName]=useState("")
const generateId=()=>{
   
    const generatedId=uuidv4();
    setId(generatedId)
}
const RoomCreatedNotify=(e)=>{
    e.preventDefault()
     if(id && userName){
        localStorage.setItem('userName', userName);
        toast.success("Room Created Successfully")
        navigate(`/editor/${id}`,{
            state:{userName},
        })
    }
    if(!userName){
        toast.error("Please enter a username")
    }
    if(!id){
        toast.error("Please enter a room id")
    }
     
}


    return (
        <>
        <div className=" h-[70%] w-[60%] border-1 border-[#527DF3] bg-gray-600 rounded-4xl shadow-[0_0_30px_5px_rgba(59,130,246,0.7)]">
            <div className="logo flex justify-center items-center p-2 m-4">
                <img src={logo} className='rounded-full h-[25%] w-[25%]'  ></img>
            </div>
            <form >
                <div className='flex flex-col justify-center items-center gap-5 '>
                    <input className='border-2 border-blue-400 rounded-4xl p-2 hover:p-4 hover:shadow-[0_0_30px_5px_rgba(59,130,246,0.7)] transition-size duration-200 focus:outline-none focus:ring-0 focus:border-blue-400 text-amber-50' value={id} type='text' placeholder='Enter Room Id' onChange={(e)=>setId(e.target.value)} required/>
                    <input className='border-2 border-blue-400 rounded-4xl p-2 hover:p-4 hover:shadow-[0_0_30px_5px_rgba(59,130,246,0.7)] transition-size duration-200   focus:outline-none focus:ring-0 focus:border-blue-400  text-amber-50' value={userName} type='text' placeholder='Enter UserName' onChange={(e)=>setUserName(e.target.value)} required/>
                </div>
                
                <div className='flex items-center justify-center mt-8'>
                <button type='submit' onClick={RoomCreatedNotify}  className='bg-blue-400 rounded-3xl text-amber-50 p-4 hover:p-5 hover:bg-blue-300 cursor-pointer transition-all duration-300'>Join</button>
                </div>
            </form>

            <div className='flex  justify-center items-center mt-3'>
                <p className='flex gap-3'>Don't have a room Id ?? <p className='text-blue-300 cursor-pointer' onClick={generateId}>Create new Room</p></p>
            </div>
        </div>
        </>
    );
}
