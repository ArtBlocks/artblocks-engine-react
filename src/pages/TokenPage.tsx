import { useParams } from "react-router-dom"
import Page from "components/Page"
import TokenDetails from "components/TokenDetails"

const TokenPage = () => {
  const { contractAddress, id } = useParams()
  return (
    <Page>
      {
        contractAddress && id && <TokenDetails contractAddress={contractAddress} id={id}/>
      }
    </Page>
  )
}

export default TokenPage
