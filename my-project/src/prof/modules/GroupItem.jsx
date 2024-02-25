export default function GroupItem({ group, quantity, unit, hours, day, start, end, prof_name, branch_tag, isLab, lab_room }) {
    return (
        <div className='relative h-full min-w-80 flex flex-col justify-center rounded-md bg-slate-700 mr-4 text-xs text-center'>

            <div className='flex self-center text-white'>
                <span className='ml-4 mr-2 px-2 bg-green-800'>หมู่: {group}</span>
                <span className='mr-2 px-2 bg-indigo-800'>จำนวน: {quantity}</span>
                <span className='mr-2 px-2 bg-yellow-800'>หน่วย: {unit}</span>
                <span className='mr-2 px-2 bg-yellow-800'>ชั่วโมง: {hours}</span>
            </div>

            <div className='flex self-center text-white mt-3'>
                <span className='ml-4 mr-2 px-2 bg-red-800'>วัน: {day}</span>
                <span className='mr-2 px-2 bg-purple-800'>เริ่ม: {start}</span>
                <span className='mr-2 px-2 bg-purple-800'>สิ้นสุด: {end}</span>
            </div>

            <div className='flex flex-col self-center text-white mt-3'>
                <div className='w-72 flex overflow-x-auto'>
                    <span className='ml-4 mr-1 px-2 bg-gray-800'>อาจารย์: </span>
                    {prof_name && prof_name.map((prof, index) => (
                        <span key={index} className='ml-1 mr-1 px-2 bg-gray-500'>{prof}</span>
                    ))}
                </div>
                <div className='w-72 flex overflow-x-auto mt-4'>
                    <span className='ml-4 mr-1 px-2 bg-gray-800'>สาขา:</span>
                    {branch_tag && branch_tag.map((branch, index) => (
                        <span key={index} className='ml-1 mr-1 px-2 bg-gray-500'>{branch}</span>
                    ))}
                </div>
                {isLab &&
                    <div className='mt-4'>
                        <span className='ml-3 mr-4 px-2 bg-gray-800'>ห้องแลป: {lab_room}</span>
                    </div>
                }
            </div>
        </div>
    );
}
