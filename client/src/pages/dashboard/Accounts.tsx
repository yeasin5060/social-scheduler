import { useState } from "react"
import { PLATFORMS } from "../../assets/assets";
import { PlusIcon } from "lucide-react";


const Accounts = () => {
  const [accounts , setAccountes] = useState<any[]>([]);
  const [connection , setConnection] = useState<string | null> (null);
  const [showPlatformPicker,setShowPlatformPicker] = useState(false);
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
        <div>
          <h2 className="text-xl text-slate-900 capitalize">connected accounts</h2>
          <p className="text-sm text-slate-500 mt-0.5">{accounts.length} of {PLATFORMS.length} platform connected</p>
        </div>
        <button onClick={()=> setShowPlatformPicker(true)} className="flex items-center px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all w-full sm:w-auto justify-center">
          <PlusIcon/> Connect Account
        </button>
      </div>
    </div>
  )
}

export default Accounts