import { useState, useCallback, useEffect } from 'react';
import { getGroupsStatusByBranch } from '../../api/Profs_API';
import ContentProfHeader from './ContentProfHeader';
import Scheduler from '../modules/Scheduler';
import InsertCourseModal from '../modules/InsertCourseModal';
import ButtonCom from '../components/ButtonCom';

export default function ContentProf({ userData, currentPage }) {
    const { name: initialProfName, role, branch_tag: initialProfBranch } = userData;

    const [profState, setProfState] = useState({
        currentBranch: initialProfBranch,
        currentBranchYear: '',
        profName: initialProfName,
        profRole: role,
        labRoom: '',
    });
    const { currentBranch, currentBranchYear, profName, profRole, labRoom } = profState;

    const handleBranchChange = selectedBranch => {
        setProfState(prevState => ({ ...prevState, currentBranch: selectedBranch }));
        handleBranchYearChange('');
    };
    const handleBranchYearChange = selectedBranchYear => {
        setProfState(prevState => ({ ...prevState, currentBranchYear: selectedBranchYear }));
    };
    const handleProfChange = selectedProf => {
        setProfState(prevState => ({ ...prevState, profName: selectedProf }));
    };
    const handleLabRoomChange = selectedLab => {
        setProfState(prevState => ({ ...prevState, labRoom: selectedLab }));
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = useCallback(() => {
        setIsModalOpen(prev => !prev)
    }, []);

    const { data: groupsBranchStatus, refetch: refetchGroupBranchStatus } = getGroupsStatusByBranch(currentBranch);
    useEffect(() => {
        refetchGroupBranchStatus();
    }, [currentBranch]);

    return (
        <div className='col-start-3 col-span-15 border-2 border-b-0 border-solid border-black bg-white'>
            <ContentProfHeader
                page={currentPage}
                branch={currentBranch} onBranchChange={handleBranchChange}
                branchYear={currentBranchYear} onBranchYearChange={handleBranchYearChange}
                profName={profName} onProfChange={handleProfChange}
                profRole={profRole}
                labRoom={labRoom} onLabRoomChange={handleLabRoomChange}
            />

            <Scheduler
                groupsStatus={groupsBranchStatus}
                curPage={currentPage}
                curBranch={currentBranch}
                curBranchYear={currentBranchYear}
                curProf={profName}
                curLab={labRoom}
            />

            <InsertCourseModal ownerProfBranch={initialProfBranch} isVisible={isModalOpen} onClose={toggleModal} />
            <ButtonCom style='rounded bg-blue-500 hover:bg-blue-700 text-white font-bold mb-4 py-2 px-4'
                text='Add Course' type='button'
                onClick={toggleModal}
            />
        </div>
    );
}