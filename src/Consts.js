const dev = {
    PATH_BASE: 'http://localhost:8080/'
}

const prod = {
    PATH_BASE: 'https://techbricksapi-iigprl63zq-uc.a.run.app/'
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod;
//export const config =  dev;