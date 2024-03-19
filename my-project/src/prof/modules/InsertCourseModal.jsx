import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCoursesContext } from '../../context/Prof-Context';
import { useAddGroupMutation } from '../../api/Profs_API';
import { useMergedGroups } from '../CustomHook/useMergedGroups';
//Components
import AlertModal from '../../public/AlertModal';
import InputSection from '../components/InputSelect';
import ButtonCom from '../components/ButtonCom';
import InsertGroups from './InsertGroups';
//data
import { initialCourseInfoState } from '../data/initialData';
import { parseCredits } from '../data/functions';

export default function InsertCourseModal({ ownerBranchTag, isVisible, onClose }) {
    const { coursesBranch } = useCoursesContext(); //for checking if this prop have ovelappign course with yourself
    const addGroupMutation = useAddGroupMutation();

    const [courseInfo, setCourseInfo] = useState(initialCourseInfoState);
    const [creditHours, setCreditHours] = useState({ lectureHours: 0, labHours: 0, selfStudyHours: 0 });

    const [lectureGroups, setLectureGroups] = useState([]);
    const [labGroups, setLabGroups] = useState([]);
    const mergedGroups = useMergedGroups(lectureGroups, labGroups);

    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [disableSubmit, setDisableSubmit] = useState(false);

    const handleCourseChange = (selectedOption) => {
        setCourseInfo(prevState => ({
            ...prevState,
            selectedCourse: selectedOption
        }));
    };

    const resetFormData = () => {
        setLectureGroups([]);
        setLabGroups([]);
        setCourseInfo(initialCourseInfoState);
    };
    const handleSubmit = async () => {
        try {
            const groupData = {
                mergedGroups,
                course_id: courseInfo.id,
                group_status: 'waiting',
                owner_branch_tag: ownerBranchTag
            };
            await addGroupMutation.mutateAsync(groupData);
            resetFormData();
            setAlertMessage('Add groups successfully');
            setOpenAlert(true);
        } catch (error) {
            console.error('Error adding group:', error);
            setAlertMessage('Error adding groups');
            setOpenAlert(true);
        }
    };

    const closeModal = () => {
        onClose();
    }
    const closeAlert = () => {
        setOpenAlert(false)
        onClose();
    }

    useEffect(() => {
        const selectedCourseData = coursesBranch?.find(course => course.combined_code_curriculum === courseInfo.selectedCourse);
        if (selectedCourseData) {
            setCourseInfo(prevState => ({
                ...prevState,
                id: selectedCourseData.id,
                th_name: selectedCourseData.th_name,
                eng_name: selectedCourseData.eng_name,
                credit: selectedCourseData.credit,
                course_type: selectedCourseData.course_type
            }));
            setCreditHours(parseCredits(courseInfo.credit));
        } else setCourseInfo(initialCourseInfoState);
    }, [courseInfo.selectedCourse, courseInfo.credit]);

    return isVisible ? (
        createPortal(
            <>
                <AlertModal isOpen={openAlert} onClose={closeAlert} message={alertMessage} />
                <div className='fixed top-0 left-0 w-screen h-screen grid place-items-center bg-gray-800 bg-opacity-50 z-50'>
                    <div className='absolute top-0 left-1/2 transform -translate-x-1/2 font-semibold p-4'>
                        <div className='flex'>
                            <InputSection style='appearance-none border border-gray-400 p-1 rounded-md focus:outline-none focus:border-blue-500 w-48'
                                value={courseInfo.selectedCourse}
                                onChange={handleCourseChange}
                                placeholder='Select a course'
                                options={coursesBranch}
                                optionKey='combined_code_curriculum'
                            />
                            <input className='w-72 rounded-lg bg-blue-100 mx-2 p-1' placeholder='thname' value={courseInfo.th_name} readOnly />
                            <input className='w-72 rounded-lg bg-blue-100 mx-2 p-1' placeholder='engname' value={courseInfo.eng_name} readOnly />
                        </div>
                        <div className='flex my-4'>
                            <input className='w-20 rounded-lg bg-blue-100 mx-2 p-1' placeholder='credit' value={courseInfo.credit} readOnly />
                            <input className='w-24 rounded-lg bg-blue-100 mx-2 p-1' placeholder='course type' value={courseInfo.course_type} readOnly />
                        </div>
                    </div>

                    <InsertGroups
                        creditHours={creditHours}
                        lectureGroups={lectureGroups} labGroups={labGroups} mergedGroups={mergedGroups}
                        setLectureGroups={setLectureGroups} setLabGroups={setLabGroups}
                        setDisableSubmit={setDisableSubmit}
                    />

                    <div className='absolute bottom-0 right-0 flex mb-4 mr-8'>
                        <ButtonCom style='rounded bg-green-500 hover:bg-green-700 text-white font-bold mr-4 py-2 px-4'
                            text='Submit' type='button' onClick={handleSubmit}
                            isDisable={disableSubmit || courseInfo.selectedCourse === ''}
                        />
                        <ButtonCom style='rounded bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4'
                            text='Close' type='button' onClick={closeModal}
                        />
                    </div>
                </div>
            </>, document.getElementById('root-modal')
        )
    ) : null;
}