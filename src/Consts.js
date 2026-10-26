const dev = {
    PATH_BASE: 'http://localhost:5000/'
}

const prod = {
    PATH_BASE: 'https://pt-techbricks-api-93484780890.europe-west1.run.app/'
}

export const config = process.env.NODE_ENV === 'development' ? prod : prod;
//export const config =  dev;