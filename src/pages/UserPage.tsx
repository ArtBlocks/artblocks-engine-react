import { useParams } from "react-router-dom"
import Page from "components/Page"
import OwnedProjects from "components/OwnedProjects"

const UserPage = () => {
  const { walletAddress } = useParams()
  return (
    <Page>
      {
        walletAddress && <OwnedProjects walletAddress={walletAddress.toLowerCase()}/>
      }
    </Page>
  )
}

export default UserPage
