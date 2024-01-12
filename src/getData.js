import {storage} from '../firebase';

// export default function getData(userId, slideName) {
//     const storageRef = storage.ref();
//     const filePath = `slides/${userId}/${slideName}`;

//     return storageRef.child(filePath).getDownloadURL().then((url) => {
//         fetch(url)
//             .then((response) => response.json())
//             .then((data) => {
//                 if (data.pages.length === 0) {
//                     const newPage = {
//                         active: true,
//                         type: '',
//                         data: '',
//                         settings: [],
//                         img: '',
//                         index: 0,
//                     };
//                     data.pages.push(newPage);
//                 }
//                 console.log(data);
//             })
//             .catch((error) => console.error('Error fetching chart data:', error));
//     }).catch((error) => {
//         console.error('Error fetching file:', error);
//     });
// }

export default function getData(userId, slideName) {
    const storageRef = storage.ref();
    const filePath = `slides/${userId}/${slideName}`;

    // 返回整个 Promise 链
    return storageRef.child(filePath).getDownloadURL().then((url) => {
        // 返回 fetch 调用的结果
        return fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (data.pages.length === 0) {
                    const newPage = {
                        active: true,
                        type: '',
                        data: '',
                        settings: [],
                        img: '',
                        index: 0,
                    };
                    data.pages.push(newPage);
                }
                console.log(data);
                return data; // 确保在这里返回数据
            })
            .catch((error) => {
                console.error('Error fetching chart data:', error);
                throw error; // 抛出错误以便外部可以捕获
            });
    }).catch((error) => {
        console.error('Error fetching file:', error);
        throw error; // 同样抛出错误
    });
}
