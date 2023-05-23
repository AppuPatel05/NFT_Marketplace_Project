import { totalCount } from "../services/services";


const loadData = async () => {
    totalCount()
          .then((response) => {
            return(response.data.nftCount)
          })
          .catch((error) => {
          });
}
  export default loadData;
