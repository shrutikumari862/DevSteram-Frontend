import { Link } from "react-router-dom";

export default function EntryPage() {
    

    return (
        <>
        <div className="background w-full h-screen flex flex-col justify-center items-center gap-10">
             <h1 className="text-4xl text-white edu-nsw-act-cursive-font">This is a platform where you can collaborate whith your mates and learn coding together</h1>
             <Link  to='/home'><button className="text-amber-50 bg-green-500 rounded-4xl p-8 text-3xl edu-nsw-act-cursive-font hover:bg-green-800 cursor-pointer transition-all duration-200 hover:text-4xl">Get Started</button></Link>
        </div>
        
        </>
    );
}
