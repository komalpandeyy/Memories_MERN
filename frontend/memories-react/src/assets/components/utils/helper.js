export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};
  
export const getInitials=(name)=>{
    let ans = "";
    let list = [];
    if(!name) return "";
    
    list = name.split(" ");
    for(var i = 0;i<Math.min(2,list.length);i++){
        ans+=list[i][0];
    }
    return ans;
}