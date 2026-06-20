import { useEffect, useState } from "react"
import { dummyAccountsData, PLATFORMS } from "../../assets/assets";
import { PlusIcon } from "lucide-react";
import AccountList from "../../components/AccountList";
import PlatformPickerModal from "../../components/PlatformPickerModal";


const Accounts = () => {
  const [accounts , setAccountes] = useState<any[]>([]);
  const [connection , setConnection] = useState<string | null> (null);
  const [showPlatformPicker,setShowPlatformPicker] = useState(false);

  const fetchAccounts = async (isSync  = false, platform?:string | null , successMsg?: string) => {
    setAccountes(dummyAccountsData);
    console.log(isSync , platform , successMsg)
  }

  useEffect(() => {
    fetchAccounts()
  },[]);

  const handleConnect = async (platformId : string) => {
    try {
      setConnection(platformId);
      setTimeout (() => {
        setConnection(null);
        setAccountes((prev) => [...prev, dummyAccountsData[0]]);
        setShowPlatformPicker(false);
      },1000)
    } catch (error) {
      
    }
  }

  const handleDisconnect = async (accountId : string) => {
    setAccountes(accounts.filter((a) => a._id !== accountId));
  }

  const connectedIds = accounts.map((a) => a.platform);

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
      {/* platform picker model */}
      {showPlatformPicker && <PlatformPickerModal connectedIds={connectedIds} connecting={connection} onClose={()=> setShowPlatformPicker(false)} onConnect={handleConnect} /> }
      {/* connected accounts list */}
      <AccountList accounts={accounts} onDisconnect={handleDisconnect}/>
    </div>
  )
}

export default Accounts