import axios from "axios";
const def_url = "http://192.168.1.134:3000/"
// const def_url = 'https://nft-render-apis.onrender.com/'
export const totalCount = ()=>{
    return  axios.get(`${def_url}nft/total-count`)
};
export const nftTransaction = (sender,receiver,nft)=>{
    return axios
      .post(`${def_url}nft/transaction`, {
        sender: sender,
        receiver: receiver,
        nft: nft,
      })
};
export const getUsername = (account)=>{
    return axios.get(`${def_url}auth/user/get-user/${account}`)
}
export const getSearchData = (searchInput)=>{
    return  axios.get(`${def_url}nft/` + searchInput)
}
export const updateMetamask = (u_name,address)=>{
    return axios
    .patch(
      `${def_url}auth/update-metamask-address`,
      {
        emailORUsername: u_name,
        metamask_address:address,
      }
    )
}
export const userSignUp = (e_mail,u_name,password,temppassword)=>{
    return axios
    .post(`${def_url}auth/signup`, {
      email: e_mail,
      username: u_name,
      password: password,
      confirm_password: temppassword,
    })
}
export const userSignIn = (u_name,password)=>{
    return axios
    .post(`${def_url}auth/signin/`, {
      email: u_name,
      password: password,
    })
}
export const usernameSignIn = (u_name,password)=>{
  return axios
  .post(`${def_url}auth/signin/`, {
    username: u_name,
    password: password,
  })
}
export const nftMint = (name,description,price,image,account,category,resellPrice,uri)=>{
    return axios
    .post(`${def_url}nft/nft-mint`, {
      nft_name: name,
      nft_description: description,
      nft_price: price,
      nft_image_link: image,
      user: account,
      category:category,
      nft_resell_count:resellPrice,
      nft_json_link:uri
    })
}
export const forgetPasswordGetMail = (u_name)=>{
    return axios.post(`${def_url}auth/forgot-password-link`, {
                email: u_name,
            })
}