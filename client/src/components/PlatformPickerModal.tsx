import { XIcon } from "lucide-react";

interface PlatformPickerModalProps {
    connectedIds : string[];
    connecting : string | null;
    onClose : () => void;
    onConnect : (platformId : string) => void
}

const PlatformPickerModal = ({connectedIds, connecting, onClose, onConnect } : PlatformPickerModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md border border-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 shadow">
                <h3 className="text-slate-700">Choose a Platform</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                    <XIcon className="size-4"/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default PlatformPickerModal