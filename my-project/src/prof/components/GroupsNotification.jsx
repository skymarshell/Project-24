import { useState } from 'react';
import view from '../../assets/view.png';
import hide from '../../assets/hide.png';

export default function GroupsNotification() {
    const [notificationPosition, setNotificationPosition] = useState({ x: 0, y: 0 });
    const [showNotification, setShowNotification] = useState(false);
    const activeColor = showNotification ? 'bg-orange-500' : '';

    const handleClick = (event) => {
        const { clientX, clientY } = event;
        setNotificationPosition({ x: clientX, y: clientY });
        setShowNotification(true);
    };

    const handleClose = () => {
        setShowNotification(false);
    };

    return (
        <div>
            <button onClick={handleClick} className={`p-2 flex items-center rounded-md text-sm font-bold text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600 ${activeColor}`}>
                <img src={showNotification ? view : hide} alt='Course Image' className='mx-1 w-6 h-6' />
                <span className="truncate">All Groups Status</span>
            </button>

            {showNotification && (
                <div className='fixed inset-0 flex items-center justify-center z-50'>
                    <div className='p-6 text-sm text-white bg-gray-800 rounded-lg shadow-md'
                        style={{ position: 'absolute', top: notificationPosition.y - 100, left: notificationPosition.x }}
                    >
                        <button onClick={handleClose} className='absolute top-2 right-2 text-gray-300 hover:text-gray-400 focus:outline-none'>
                            <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>

                        <h2 className='my-2 text-lg font-semibold'>Groups Status: T12</h2>
                        <div className='flex gap-3'>
                            <p>waiting: </p>
                            <p>accept: </p>
                            <p>reject: </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};