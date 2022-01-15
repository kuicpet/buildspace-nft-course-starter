import './styles/App.css'
import twitterLogo from './assets/twitter-logo.svg'
import React, { useEffect, useState } from 'react'
import { ethers} from 'ethers'
import myEpicNft from './utils/MyEpicNFT.json'

// Constants
const TWITTER_HANDLE = 'kuicpet'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`
const OPENSEA_LINK = ''
const TOTAL_MINT_COUNT = 50
const CONTRACT_ADDRESS = '0x7F975688aA9Fa3297AB0D276787d75BaBA8d3034'

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [minting, setMinting] = useState(false)
  const [openSeaLink, setOpenSeaLink] = useState(OPENSEA_LINK)
  const [mintCounts, setMintCounts] = useState([])
  // Check if Wallet Connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window
    if (!ethereum) {
      console.log('Make sure you have metamask!')
      return
    } else {
      console.log('We have the ethereum object', ethereum)
    }
    // check if authorized
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log('Found an authorized account', account)
      setCurrentAccount(account)
    } else {
      console.log('no authorized account found')
    }
  }
  // connect wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert('get MetaMask!')
        return
      } else {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        })
        console.log('Connected', accounts[0])
        setCurrentAccount(accounts[0])
        setUpEventListener()
      }
    } catch (error) {
      console.log(error)
    }
  }
  // setup listener
  const setUpEventListener = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        )
        connectedContract.on('NewEpicNFTMinted', (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(
            `Hey there,We"ve minted your NFT and sent it to your Wallet.It may be blank right now.it can take a max of 10 min to show up on OpenSea.Here"s the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          )
        })
        console.log('Setup event listener!')
      } else {
        console.log('Ethereum object doesn"t exist!')
      }
    } catch (error) {
      console.log(error)
    }
  }

  // mint NFT
  const mintNft = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        )
        console.log('Going to pop wallet now to pay gas...')
        let nftTxn = await connectedContract.makeAnEpicNFT()
        console.log('Minting...please wait.')
        setMinting(true)
        await nftTxn.wait()
        console.log(
          `Minted, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        )
        setMinting(false)
      } else {
        console.log('Ethereum object doesn"t exist!')
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className='cta-button connect-wallet-button'
    >
      Connect to Wallet
    </button>
  )

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <div className='App'>
      <div className='container'>
        <div className='header-container'>
          <p className='header gradient-text'>My NFT Collection</p>
          <p className='sub-text'>
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === '' ? (
            renderNotConnectedContainer()
          ) : (
            <button
              onClick={mintNft}
              className='cta-button mint-button'
            >
              {minting ? 'Minting...': 'Mint NFT'}
            </button>
          )}
        </div>
        <div>
          <button className='cta-button opensea-button'>🌊 View Collection on OpenSea</button>
        </div>
        <div className='footer-container'>
          <img alt='Twitter Logo' className='twitter-logo' src={twitterLogo} />
          <a
            className='footer-text'
            href={TWITTER_LINK}
            target='_blank'
            rel='noreferrer'
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  )
}

export default App
