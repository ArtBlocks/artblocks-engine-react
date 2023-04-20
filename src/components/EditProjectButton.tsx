import {
    Button,
    Typography
} from "@mui/material"

interface Props {
    contractAddress: string,
    projectId: string,
    editProjectUrl: string
}

const EditProjectButton = ({contractAddress, projectId, editProjectUrl}: Props) => {
    return (
        <Button
            variant="contained"
            color="primary"
            onClick={() =>
                window.open(`${editProjectUrl}/${contractAddress}/${projectId}`, '_blank')
            }
            sx={{
                minWidth: "210px",
                paddingTop: 1.5,
                paddingRight: 1,
                paddingLeft: 1,
                paddingBottom: 1.5,
                boxShadow: "none",
                textTransform: "none"
            }}>
            <Typography fontSize={16} fontWeight={800}>
                {"Edit Project"}
            </Typography>
        </Button>
    )
}

export default EditProjectButton
