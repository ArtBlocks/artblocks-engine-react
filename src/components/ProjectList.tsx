import useProjects from 'hooks/useProjects';
import { Project } from 'utils/types';

const ProjectList = () => {
  const { loading, error, data } = useProjects();

  return (
    <div>      
      {
        data?.projects && (
          data.projects.map((project: Project) => (
            <div key={project.id}>
              <h1>{ project.name }</h1>
            </div>
          ))
        )
      }
    </div>
  )
}

export default ProjectList;
