require("@nomiclabs/hardhat-waffle");
require('dotenv').config({ path: '.env' })




module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/0CdZU2dGjnVCArJCIts-Wx1ko536PK6e',
      accounts: ['34027c8f5f45cd8f9d43c3ba7ae6a83c033291ae8af2f3c58fcbd0c7dc21647d']
    }
  }
};
