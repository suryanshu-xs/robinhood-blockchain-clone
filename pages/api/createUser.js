import { client } from "../../lib/sanityClient";



const createUser = async (req, res) => {
    try {
        const userDoc = {
            _type:'users',
            _id:req.body.walletAddress,
            userName:'Unnamed',
            address:req.body.walletAddress
        
        }

        await client.createIfNotExists(userDoc)
        res.status(201).send({message:'Succress'})

    } catch (error) {
        res.status(500).send({ message: 'error', error: error.message })
    }
}


export default createUser