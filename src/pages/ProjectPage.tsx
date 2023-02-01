import { useParams } from "react-router-dom"
import { CORE_CONTRACT_ADDRESS } from "config"
import Page from "components/Page"
import ProjectDetails from "components/ProjectDetails"

const ProjectPage = () => {
  const { projectId } = useParams()
  return (
    <Page> 
      {
        projectId && <ProjectDetails id={CORE_CONTRACT_ADDRESS?.toLowerCase()+"-"+projectId}/>
      }
    </Page>
  )
}

export default ProjectPage