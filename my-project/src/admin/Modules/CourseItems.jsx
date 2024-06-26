import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDeleteCourseMutation, useUpdateCourseMutation } from '../../api/admin_api';
import ConfirmationModal from '../../public/ConfirmationModal';
import AlertModal from '../../public/AlertModal';

export default function CourseItems({ courses, onShowBranches, refetchCourses }) {
  const [searchTerm, setSearchTerm] = useState('');

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const [courseToDelete, setCourseToDelete] = useState(null);
  const [message, setMessage] = useState('');

  const deleteCourseMutation = useDeleteCourseMutation();
  const updateCourseMutation = useUpdateCourseMutation();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const filteredData = courses.filter((courses) => courses.course_code.toLowerCase().includes(searchTerm.toLowerCase()));

  const deleteCourse = (course) => {
    setCourseToDelete(course);
    setMessage(`คุณต้องการลบ ${course.course_code} ${course.curriculum} ${course.th_name} ${course.eng_name} ${course.credit} ${course.course_type}?`);
    setIsConfirmationVisible(true);
  };
  const confirmDeleteCourse = async () => {
    if (courseToDelete) {
      try {
        await deleteCourseMutation.mutateAsync(courseToDelete.id);
        setCourseToDelete(null);
      } catch (error) {
        console.error("Error deleting course:", error);
        alert(error);
      }
    }
    setIsConfirmationVisible(false);
  };
  const cancelDeleteCourse = () => {
    setCourseToDelete(null);
    setIsConfirmationVisible(false);
  };

  const edit_course = (id) => {
    input_toggle(id);
  };
  const input_toggle = (id) => {
    let d = document;
    let code = d.getElementById(`course_code_${id}`);
    let curriculum = d.getElementById(`curriculum_${id}`);
    let th = d.getElementById(`th_${id}`);
    let eng = d.getElementById(`eng_${id}`);
    let credit = d.getElementById(`credit_${id}`);
    let type = d.getElementById(`coruse_type_${id}`);
    code.classList.toggle('hidden');
    curriculum.classList.toggle('hidden');
    th.classList.toggle('hidden');
    eng.classList.toggle('hidden');
    credit.classList.toggle('hidden');
    type.classList.toggle('hidden');
    document.getElementById(`submit-${id}`).classList.toggle('hidden');
  };
  const submit_edit = async (id) => {
    input_toggle(id);
    setMessage(`คุณต้องการอัพเดทรายวิชา id ${id}`);
    setIsAlertVisible(true);

    let updatedCourseData = {
      id: id,
      course_code: document.getElementById(`course_code_${id}`).value,
      curriculum: document.getElementById(`curriculum_${id}`).value,
      th_name: document.getElementById(`th_${id}`).value,
      eng_name: document.getElementById(`eng_${id}`).value,
      credit: document.getElementById(`credit_${id}`).value,
      course_type: document.getElementById(`coruse_type_${id}`).value
    };

    try {
      const result = await updateCourseMutation.mutateAsync(updatedCourseData);
      setMessage(result.message);
      refetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
      setMessage(error.toString());
    }
  };

  const columns = [
    {
      name: 'Course code',
      selector: row => row.course_code,
      sortable: true,
      cell: row => (
        <div>
          <p>{row.course_code}</p>
          <input className={`input-${row.id} border-yellow-950 mt-3 rounded-md border-solid border-2 w-full hidden`}
            type='text'
            id={`course_code_${row.id}`}
            defaultValue={row.course_code}
          />
        </div>
      ),
    },
    {
      name: 'Curriculum',
      selector: row => row.curriculum,
      sortable: true,
      cell: row => (
        <div>
          <p>{row.curriculum}</p>
          <input className={`input-${row.id} border-yellow-950 mt-3 rounded-md border-solid border-2 w-full hidden`}
            type='text'
            id={`curriculum_${row.id}`}
            defaultValue={row.curriculum}
          />
        </div>
      ),
    },
    {
      name: 'Thai Name',
      selector: row => row.th_name,
      sortable: true,
      cell: row => (
        <div>
          <p>{row.th_name}</p>
          <textarea className={`input-${row.id}  border-yellow-950 mt-3 rounded-md border-solid border-2 w-full hidden`}
            type='text-area'
            id={`th_${row.id}`}
            defaultValue={row.th_name}></textarea>
        </div>
      ),
    },
    {
      name: 'English Name',
      selector: row => row.eng_name,
      sortable: true,
      cell: row => (
        <div>
          <p>{row.eng_name}</p>
          <textarea
            className={`input-${row.id} border-yellow-950 mt-3 rounded-md border-solid border-2 w-full hidden`}
            type='text'
            id={`eng_${row.id}`}
            defaultValue={row.eng_name}></textarea>
        </div>
      ),
    },
    {
      name: 'Credit',
      selector: row => row.credit,
      sortable: true,
      cell: row => (
        <div>
          <p> {row.credit}</p>
          <input
            className={`input-${row.id} border-yellow-950 mt-3 rounded-md border-solid border-2 w-full hidden`}
            type='text'
            id={`credit_${row.id}`}
            defaultValue={row.credit}
          />
        </div>
      ),
    },
    {
      name: 'Course Type',
      selector: row => row.course_type,
      sortable: true,
      cell: row => (
        <div>
          <p> {row.course_type}</p>
          <input className={`input-${row.id} border-yellow-950 mt-3 rounded-md border-solid border-2 w-full hidden`}
            type='text'
            id={`coruse_type_${row.id}`}
            defaultValue={row.course_type}
          />
        </div>
      ),
    },
    {
      name: 'Delete',
      selector: row => [
        row.id,
        row.course_code,
        row.curriculum,
        row.th_name,
        row.eng_name,
        row.credit,
        row.course_type,
      ],
      cell: row => (
        <div>
          <button className='text-black hover:text-white bg-red-400  hover:bg-red-600 px-3 py-1 rounded-md border-solid border-2 border-black'
            onClick={() => deleteCourse(row)}>
            Delete
          </button>
        </div>
      ),
    },
    {
      name: 'Edit',
      selector: row => [
        row.id,
        row.course_code,
        row.curriculum,
        row.th_name,
        row.eng_name,
        row.credit,
        row.course_type,
      ],
      cell: row => (
        <div className='flex'>
          <button className='w-14 text-black hover:text-white bg-green-400  hover:bg-green-600 px-3 py-1 rounded-md border-solid border-2 border-black'
            onClick={() =>
              edit_course(
                row.id,
                row.course_code,
                row.curriculum,
                row.th_name,
                row.eng_name,
                row.credit,
                row.course_type
              )
            }
          >
            Edit
          </button>
        </div>
      ),
    },
    {
      name: '',
      selector: row => [
        row.id,
        row.course_code,
        row.curriculum,
        row.th_name,
        row.eng_name,
        row.credit,
        row.course_type,
      ],
      cell: row => (
        <div className='flex'>
          <button className='text-black hover:text-white bg-blue-400  hover:bg-blue-600 px-3 py-1 rounded-md border-solid border-2 border-black hidden'
            id={`submit-${row.id}`}
            onClick={() => submit_edit(row.id)}
          >
            Submit
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {isConfirmationVisible && (
        <ConfirmationModal isOpen={isConfirmationVisible}
          message={message}
          onConfirm={courseToDelete ? confirmDeleteCourse : submit_edit}
          onCancel={cancelDeleteCourse}
        />
      )}
      {isAlertVisible && (
        <AlertModal isOpen={isAlertVisible}
          onClose={() => setIsAlertVisible(false)}
          message={message}
        />
      )}

      <button className='col-span-8 rounded text-white font-bold bg-blue-500 hover:bg-blue-700 ms-10 mb-3 py-2 px-4'
        onClick={onShowBranches}>
        Return to Branch
      </button>
      <br />
      <input className='ms-10  mt-5 mb-4 px-2 py-1 rounded border'
        type='text'
        placeholder='Search by ID'
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className='ms-10 w-[90%] -z-[10]'>
        <DataTable columns={columns}
          data={filteredData}
          highlightOnHover
          striped
          responsive
          pagination
        />
      </div>
    </>
  );
}
