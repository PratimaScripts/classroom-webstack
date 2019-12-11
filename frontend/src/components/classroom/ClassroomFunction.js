import axios from 'axios';
var url = "http://localhost:3000/";


//that day u know what happened on that token problem no dear
export const AddClass = newClass => {
    const token = localStorage.getItem("token");
    return axios.post(
        url + "classroom/", newClass, {
            headers: { Authorization: `Bearer ${token}` }
        }
    ).then(res=>{
        return res.data;
    })
}

export const GetClasses=() => {
    const token = localStorage.getItem("token");
    return axios.get(url + "classroom/", {
        headers: { Authorization:  `Bearer ${token}`}
    }).then(res => {
        return res;
    })
}

export const GetClass=(id) => {
    const token = localStorage.getItem("token");
    return axios.get( url + `classroom/${id}`,{
        headers: { Authorization: `Bearer ${token}`}
    }).then(res => {
        return res.data.classroom;
    })
}

export const UpdateClass=(data, id)=>{
    const token = localStorage.getItem("token");
    return axios.put(url +  `classroom/${id}`, data, {
        headers: {Authorization: `Bearer ${token}`}
    }).then(res => {
        return res.data;
    })
}

export const DeleteClass=(id) => {
    const token = localStorage.getItem("token");
    return axios.delete( url + `classroom/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
    }).then(res => {
        return res.data;
    })
}