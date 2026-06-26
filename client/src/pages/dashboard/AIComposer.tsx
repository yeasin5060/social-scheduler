import { useEffect, useState } from "react"
import { dummyGenerationData } from "../../assets/assets";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";


const AIComposer = () => {
  const [prompt , setPrompt] = useState('');
  const [tone , setTone] = useState('Professional');
  const [generateImage , setGeneratImage] = useState(true);
  const [loading , setLoading] = useState(false);
  const [generations , setGenerations] = useState<any[]>([]);

  //scheduling state
  const [activeScheduler , setActiveScheduler] = useState<any>(null);
  const [selectedPlatforms , setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledDate , setScheduledDate] = useState('');
  const [scheduledTime , setScheduledTime] = useState('');
  const [scheduling , setScheduling] = useState(false);

  const fetchGenerations = async () => {
    setGenerations(dummyGenerationData);
  }

  useEffect(()=> {
    fetchGenerations();
  },[]);

  const tones = ["Professional","Creative","Funny","Minilist","Excited"];

  const handleGenerate = async () => {
    setLoading(true);
    setTimeout(()=>{
      setLoading(false)
    },2000)
  }
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* input section */}
      <div className="space-y-6 text-center mt-20">
        <h1 className="text-3xl text-slate-700 tracking-tight">What should we create today</h1>
        <div className="relative group mt-12">
          <textarea className="w-full py-6 px-6 bg-white bprder border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 transition resize-none h-40" placeholder="Share you idea...(e.g A post about the launch of your new eco-friendly coffee beans" value={prompt} onChange={(e)=> setPrompt(e.target.value)}/>
            <div className="absolute bottom-4 right-2.5 flex items-center gap-3 text-sm">
              <button onClick={()=> setGeneratImage(!generateImage)} className="flex items-center gap-3 py-2 px-3 bg-red-50 rounded-lg">
                <span>AI Image</span>
                <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${generateImage ? "bg-red-500" : "bg-slate-200"}`}>
                  <span className={`pointer-events-none size-4 transform translate-y-0.5 rounded-full bg-white transition ${generateImage ? "translate-x-4.5" : "translate-x-0.5"}`}/>
                </div>
              </button>
              <button onClick={handleGenerate} className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 px-4 py-2 rounded-lg">
                {loading ?
                (
                  <>
                    <Loader2Icon className="size-4 animate-spin"/>
                    <span>Generating...</span>
                  </>
                )
                :
                (
                  <>
                    Generate
                    <ArrowRightIcon className="size-4"/>
                  </>
                )}
              </button>
            </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {tones.map((t)=> (
            <button key={t} onClick={()=> setTone(t)} className={`px-4 py-1.5 rounded-full text-sm transition-all border ${tone === t ? "bg-red-500 border-red-500 text-white" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {/* AI generated post */}
    </div>
  )
}

export default AIComposer