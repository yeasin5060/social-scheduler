import { useEffect, useState } from "react"
import { dummyPostsData, PLATFORMS } from "../../assets/assets";
import { CalendarIcon, ClockIcon, XIcon } from "lucide-react";


const Scheduler = () => {

  const [posts , setPosts] = useState<any[]>([]);
  const [content , setContent] = useState('');
  const [scheduledDate , setScheduledDate] = useState('');
  const [scheduledTime , setScheduledTime] = useState('');
  const [selectedPlatforms , setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile , setMediaFile] = useState<File | null> (null);
  const [loading , setLoading] = useState(false);

  const fetchPosts = async () => {
    setPosts(dummyPostsData)
  }

  useEffect(() => {
    (async ()=> await fetchPosts())();
    const interval = setInterval(async ()=> await fetchPosts(),1000)
    return () => clearInterval(interval);
  },[]);

  const scheduled = posts.filter((p)=> p.status === 'scheduled');
  const published = posts.filter((p)=> p.status === 'published');

  const togglePlatform = (id : string)=> setSelectedPlatforms((prve)=> (prve.includes(id) ? prve.filter((p)=> p !== id) : [...prve, id]));

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(()=> {
      setLoading(false);
      setPosts((prve) => [...prve , dummyPostsData[0]]);
    },1000)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* --- compose panel --- */}
      <div className="w-full lg:w-[460px] shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg text-slate-700 capitalize">compose post</h2>
          </div>
          <form className="space-y-5" onSubmit={handleSchedule}>
            {/* --- platforms --- */}
            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">platforms</label>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p)=>{
                  const active = selectedPlatforms.includes(p.id);
                  return (
                    <button onClick={() => togglePlatform(p.id)} key={p.id} type="button" className={`flex items-center gap-1.5 p-3 rounded-md border transition-all duration-150 ${active ? "bg-red-50 border-red-300 text-red-500 scale-103" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                      <p.icon className ="size-4.5"/>
                    </button>
                  )
                })}
              </div>
            </div>
            {/* --- content --- */}
            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">content</label>
              <textarea className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder-slate-400 outline-none resize-none" required rows={5} placeholder="What da you want to share today?" value={content} onChange={(e) => setContent(e.target.value)}/>
                <div className={`text-right text-xs mt-1 font-medium ${content.length > 270 ? "text-red-500" : "text-slate-400"}`}>
                  {content.length} / 280
                </div>
            </div>
            {/* --- media upload --- */}
            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">media (optional)</label>
              {mediaFile ? 
              (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                {mediaFile.type.startsWith('image/') 
                ? 
                <img src={URL.createObjectURL(mediaFile)} alt="preview" className="w-full h-40 object-cover"/> 
                : 
                <video src={URL.createObjectURL(mediaFile)} className="w-full h-40 object-cover" controls />}
                <button type="button" onClick = {()=> setMediaFile(null)} className="absolute top-2 right-2 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full flex items-center justify-center transition-colors">
                  <XIcon className="size-3.5"/>
                </button>
              </div>
              )
              :
              (
                <label className="flex items-center justify-center gap-2 p-5 py-10 border border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all group">
                  <span className="text-sm text-slate-500 group-hover:text-red-600 transition-colors">Click to upload image or video</span>
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={(e)=> e.target.files?.[0] && setMediaFile(e.target.files[0])} />
                </label>
              )}
            </div>
            {/* --- Date and Time --- */}
            <div className = "grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 uppercase mb-2">date</label>
                <div className="relative">
                  <CalendarIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                  <input type="date" required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm outline-none" value={scheduledDate} onChange={(e)=> setScheduledDate(e.target.value)}/>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase mb-2">date</label>
                <div className="relative">
                  <ClockIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                  <input type="time" required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm outline-none" value={scheduledTime} onChange={(e)=> setScheduledTime(e.target.value)}/>
                </div>
              </div>
            </div>
            {/* --- submit --- */}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Scheduler