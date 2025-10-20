import { useState } from 'react';
import logo from '../../assets/logo.png'
import Avatar from 'react-avatar'
import Editor from '../components/Editor';
import { useRef } from 'react';
import {Navigate, useLocation,useParams} from 'react-router-dom'
import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { initSocket } from '../../socket';
import toast from 'react-hot-toast';

export default function EditorPage() {
    const navigate=useNavigate()
    const socketRef=useRef(null);
    const codeRef=useRef(null);
    const location=useLocation();
    const [client,setClient]=useState([])
    const {roomId}=useParams();
    useEffect(()=>{
        const init=async()=>{
         socketRef.current=await initSocket();
         
         
         const handelError=(e)=>{
            console.log('socket error=>',e);
            toast.error('socket connection failed')
            navigate('/home')
         }
         
         socketRef.current.on('connect_error',handelError)
         socketRef.current.on('connect_failed',handelError)
         


          socketRef.current.emit('join',{
            roomId,
            userName:location.state?.userName || localStorage.getItem('userName'),
            
          });
          
          socketRef.current.on('joined',({clients,userName})=>{
            if(!userName) return <Navigate to='/home' />
            if(userName!==location.state?.userName|| localStorage.getItem('userName')){
                toast.success(`${userName} joined the room`)
                
            }
            setClient(clients)
            
            socketRef.current.emit('code-change',{
                code: codeRef.current,
                roomId,
            })
          });
          //disconnected
          socketRef.current.on('disconnected',({socketId,userName})=>{
            toast.success(`${userName} left the room`);
            setClient((prev)=>{
                return prev.filter((client)=>{
                    return client.socketId!==socketId
                })
            })
          })
        }
        init();

        return ()=>{
            socketRef.current.disconnect();
            socketRef.current.off('joined');
            socketRef.current.off('disconnected');
        }
    },[])

    

    if(!location.state){
        return <Navigate to='/home' />
    }



    const copyRoomId=async()=>{
        try {
            await navigator.clipboard.writeText(roomId)
            toast.success('room id copied to clipboard')
        } catch (error) {
            toast.error(`Unable to copy room id ${error}`)
        }
    }
    const leaveRoom=()=>{
        navigate('/home')
    }
    return (
        <>
        <div className="flex h-screen w-full ">
            <div className="w-[30%]  bg-gray-700 h-screen border-blue-500 border-1 shadow-[0_0_30px_5px_rgba(59,130,246,0.7)] rounded-3xl p-5 m-1 justify-between">
                     <div className='flex justify-start items-center'>
                        <img src={logo} className='rounded-full w-[30%]'></img>
                        
                     </div>
                     <hr className='mt-7'></hr>

                     <div>
                        <p className='text-white'>Members</p>
                        <div className='h-[500px] w-full border-2 border-blue-200 rounded-4xl p-5  flex flex-col overflow-scroll no-scrollbar'>
                          {client.map((i)=>{
                            return(
                                <div className='flex gap-5 border-2 border-amber-50 rounded-4xl m-2 p-2 text-amber-50 justify-center items-center bg-gray-900 w-[90%]' key={i.socketid}>
                                     <Avatar name={i.userName} size="20" className='rounded' />

                                    <p className=''>{i.userName}</p>
                                </div>
                            )
                          })}
                        </div>
                     </div>

                     <div className='flex flex-col justify-center items-center gap-4 mt-5'>
                        <button onClick={copyRoomId}  className='bg-green-100 rounded-3xl p-3 hover:bg-green-200 transition-all duration-300 cursor-pointer hover:shadow-[0_0_5px_limegreen] text-gray-950'>Copy Room Id</button>
                        <button onClick={leaveRoom}   className='bg-red-100 hover:bg-red-200 rounded-3xl p-3  transition-all duration-300 cursor-pointer hover:shadow-[0_0_10px_red] text-gray-950'>Leave Room</button>
                     </div>
            </div>
            <div className="w-[80%] h-screen overflow-h-scroll no-scrollbar">
                 <Editor/>
            </div>
        </div>
        </>
    );
}
