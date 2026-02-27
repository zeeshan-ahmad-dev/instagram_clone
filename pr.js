const url = "https://res.cloudinary.com/dkd7a29k3/image/upload/v1772134358/insta_clone/pfp/s0oljsvfpp6axjmqoocg.jpg";

let cutUrl = url.split("/").splice(-1).join('').split('.')[0];

console.log(cutUrl);