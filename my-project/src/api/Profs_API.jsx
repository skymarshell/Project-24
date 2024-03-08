import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

//API Context
const useGroupsByBranchYear = (branchYear) => {
    const queryKey = ['groups', branchYear];

    const fetchGroupsByBranchYear = async () => {
        try {
            const response = await axios.get(`/profs/groups/${encodeURIComponent(branchYear)}`);
            const data = response.data.map(group => ({
                ...group,
                prof_names: group.prof_names || [] // Ensure prof_names is an array even if it's null
            }));
            return data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.error(`No groups found for the selected branch and year.`);
            } else {
                console.error(`Failed to fetch groups: ${error.message}`);
            }
        }
    };

    return useQuery(queryKey, fetchGroupsByBranchYear);
};

const useAddGroupMutation = () => {
    const queryClient = useQueryClient();

    const addGroup = async (groupData) => {
        try {
            const response = await axios.post('/profs/addGroups', groupData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data.error || 'Failed to add group. Please try again later.');
        }
    };

    return useMutation((groupData) => addGroup(groupData), {
        onSuccess: () => {
            queryClient.invalidateQueries('groups');
        },
    });
};

export { useAddGroupMutation, useGroupsByBranchYear }