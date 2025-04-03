import { useParams } from 'react-router-dom'

const Detail = () => {
    const {uuid}= useParams();
  return (
    <div>{uuid && uuid}</div>
  )
}

export default Detail