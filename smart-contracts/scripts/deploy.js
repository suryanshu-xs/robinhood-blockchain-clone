const { ethers } = require('hardhat')


const main = async () => {
    const bitcoinFactory = await ethers.getContractFactory('Btc')
    const bitcoinContract = await bitcoinFactory.deploy()
    await bitcoinContract.deployed()
    console.log('Bitcoin deployed to : ',bitcoinContract.address)

    const solanaFactory = await ethers.getContractFactory('Solana')
    const solanaContract = await solanaFactory.deploy()
    await solanaContract.deployed()
    console.log('Soalana deployed to : ',solanaContract.address)

    const usdFactory = await ethers.getContractFactory('Usdc')
    const usdcContract = await usdFactory.deploy()
    await usdcContract.deployed()
    console.log('USDC deployed to : ',usdcContract.address)
    
}

;(async () => {
    try {
        await main()
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
})()