import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className='flex flex-col items-center justify-center h-screen gap-4'>
            <h1 className='text-4xl font-bold'>404</h1>
            <p className='text-2xl'>Page Not Found</p>
            <Link to='/' className='text-blue-500 hover:text-blue-700'>Go to Home</Link>
        </div>
    )
}

export default NotFound