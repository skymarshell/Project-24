import { useState } from 'react';

export default function TableRow({ courseCode, defaultCurriculum, thName, engName, credits, courseType, isTransfer, onTransfer, rowData, options }) {
    const [localSelectedCurriculum, setLocalSelectedCurriculum] = useState('');

    const handleCurriculumChange = (e) => {
        const newCurriculum = e.target.value;
        rowData.curriculum = e.target.value;
        setLocalSelectedCurriculum(newCurriculum);
    };

    const handleTransfer = () => {
        const selectedCurriculumToUse = localSelectedCurriculum !== '' ? localSelectedCurriculum : defaultCurriculum;
        onTransfer({
            ...rowData,
            curriculum: selectedCurriculumToUse
        });
    };

    return (
        <tr>
            <td className='py-2 w-28'>{courseCode}</td>
            <td className='py-2 w-10'>
                <select
                    className='border border-gray-300 rounded-md px-2 py-1 mt-1 focus:outline-none focus:border-blue-500'
                    value={localSelectedCurriculum !== '' ? localSelectedCurriculum : defaultCurriculum}
                    onChange={handleCurriculumChange}
                >
                    {options}
                </select>
            </td>
            <td className='px-4 py-2'>{thName}</td>
            <td className='px-4 py-2'>{engName}</td>
            <td className='py-2 w-20'>{credits}</td>
            <td className='py-2 w-28'>{courseType}</td>
            <td className='py-2 w-16'>
                {!isTransfer &&
                    <button className='rounded bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1' onClick={handleTransfer}>
                        Transfer
                    </button>
                }
                {isTransfer &&
                    <button className='rounded bg-red-500 hover:bg-red-600 text-white px-2 py-1' onClick={handleTransfer}>
                        Delete
                    </button>
                }
            </td>
        </tr>
    );
}
