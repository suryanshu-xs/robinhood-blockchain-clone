import { createContext, useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { bitcoinABI, solanaABI, usdcABI, bitcoinAddress, solanaAddress, usdcAddress } from '../lib/constants'

export const RobinhoodContext = createContext()


export const RobinhoodProvider = ({ children }) => {

    const { isAuthenticated, authenticate, user, logout, Moralis, enableWeb3 } = useMoralis()

    const [currentAccount, setCurrentAccount] = useState('')
    const [formattedAccount, setFormattedAccount] = useState('')
    const [coinSelect, setCoinSelect] = useState('BTC')
    const [toCoin, setToCoin] = useState('')
    const [balance, setBalance] = useState('')
    const [amount, setAmount] = useState('')

    useEffect(() => {
        if (isAuthenticated) {
            const getAccountBalance = async () => {
                const account = user.get('ethAddress')
                let formattedAcc = account.slice(0, 4) + '.....' + account.slice(-4)
                setFormattedAccount(formattedAcc)
                setCurrentAccount(account)
                const currentBalance = await Moralis.Web3API.account.getNativeBalance({
                    chain: 'rinkeby',
                    address: currentAccount
                })
                const balanceToEth = Moralis.Units.FromWei(currentBalance.balance)
                const formattedBalance = parseFloat(balanceToEth).toFixed(3)
                setBalance(formattedBalance)
            }
            getAccountBalance()
        }
    }, [isAuthenticated, enableWeb3])


    useEffect(() => {
        if (!currentAccount) {
            return
        } else {
            const createNewUser = async () => {
                const response = await fetch('/api/createUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        walletAddress: currentAccount
                    })
                })
                const data = await response.json()
                console.log(data);
            }
            createNewUser()


        }

    }, [currentAccount])

    const getContractAddress = () => {
        if (coinSelect === 'BTC') return bitcoinAddress
        if (coinSelect === 'SOL') return solanaAddress
        if (coinSelect === 'USDC') return usdcAddress
    }
    const getToAddress = () => {
        if (toCoin === 'BTC') return bitcoinAddress
        if (toCoin === 'SOL') return solanaAddress
        if (toCoin === 'USDC') return usdcAddress
    }
    const getToAbi = () => {
        if (toCoin === 'BTC') return bitcoinABI
        if (toCoin === 'SOL') return solanaABI
        if (toCoin === 'USDC') return usdcABI
    }

    const mint = async () => {
        try {
            if (coinSelect === 'ETH') {
                if (!isAuthenticated) return
                await Moralis.enableWeb3()
                const contractAddress = getToAddress()
                const abi = getToAbi()
                let options = {
                    contractAddress: contractAddress,
                    functionName: 'mint',
                    abi: abi,
                    params: {
                        to: currentAccount,
                        amount: Moralis.Units.Token('50', '10')

                    }
                }
                sendEth(contractAddress)
                const transaction = await Moralis.executeFunction(options)
                const receipt = await transaction.wait(4)
                saveTransaction(receipt.transactionHash, amount, receipt.to)

            } else {
                swapTokens()
                saveTransaction(receipt.transactionHash, amount, receipt.to)
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const swapTokens = async () => {
        try {
            if (!isAuthenticated) return

            if (coinSelect === toCoin) return

            const fromOptions = {
                type: 'erc20',
                amount: Moralis.Units.Token(amount, '18'),
                receiver: getContractAddress(),
                contractAddress: getContractAddress()
            }

            const toMintOptions = {
                contractAddress: getToAddress(),
                functionName: 'mint',
                abi: getToAbi(),
                params: {
                    to: currentAccount,
                    amount: Moralis.Units.Token(amount, '18')
                }
            }

            let fromTransaction = await Moralis.transfer(fromOptions)
            let toMintTransaction = await Moralis.executeFunction(toMintOptions)
            let fromReceipt = await fromTransaction.wait()
            let toReceipt = await toMintTransaction.wait()

            console.log(fromReceipt);
            console.log(toReceipt);

        } catch (error) {

        }
    }

    const sendEth = async (contractAddress) => {
        if (!isAuthenticated) return

        let options = {
            type: 'native',
            amount: Moralis.Units.ETH('0.01'),
            receiver: contractAddress
        }
        const transaction = await Moralis.transfer(options)
        const receipt = await transaction.wait()
        console.log(receipt);
        saveTransaction(receipt.transactionHash, '0.01', receipt.to)
    }

    const saveTransaction = async (txHash, currentAccount, getToAddress) => {
        await fetch('/api/swapTokens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                txHash: txHash,
                from: currentAccount,
                to: getToAddress,
                amount: parseFloat(amount)
            })
        })
    }



    const connectWallet = () => {
        authenticate()
    }

    const signOut = () => {
        logout()
    }


    return <RobinhoodContext.Provider
        value={{ connectWallet, signOut, currentAccount, isAuthenticated, formattedAccount, setAmount, mint, setCoinSelect, coinSelect, balance, swapTokens, amount, toCoin, setToCoin }}
    >
        {children}
    </RobinhoodContext.Provider>
}