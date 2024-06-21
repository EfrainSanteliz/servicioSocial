import Api  from './Api'
import axios from 'axios'

class StudentsApi extends Api {
    async list(){
        const request = async () => await axios.get(this.generateAbsolutePath('students'));
            
        const { data } = await this.perform(request);

        return data;
    }

    async update(control_number, data){
        const  request = async () => await axios.put(this.generateAbsolutePath(`students/${control_number}`), data);

        return await this.perform(request);
    }

}

export default StudentsApi;