import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading:React.FC = () => {
    return (
        <div className='flex items-center justify-center h-screen'>
            <Loader2 className="h-10 w-10 animate-spin" />
        </div>
    )
}

export default Loading