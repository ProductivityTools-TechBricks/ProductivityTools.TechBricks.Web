const dev = {
    PATH_BASE: 'http://localhost:8080/'
}

const prod = {
    PATH_BASE: 'https://localhost:8001/api/'
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod;