// ExampleComponent.tsx
import { Button } from '@mantine/core'
import api from './route' // adjust the path if needed
import { useState } from 'react'

export function FetchButton() {
  const [data, setData] = useState(null)

  const handleClick = async () => {
    try {
      const response = await api.get('') // e.g. /users, /ping
      setData(response.data)
      console.log('Fetched data:', response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <div>
      <Button onClick={handleClick}>Fetch Data</Button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}
