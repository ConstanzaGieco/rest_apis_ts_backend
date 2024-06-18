import request from "supertest";
import server from "../../server";

describe('POST api/products', () => {

    it('should display validation errors', async () => {
        const res = await request(server).post('/api/products').send({})
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(4) //si el producto está vacio, me debe largar los 4 mensajes que cree

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(2)
    })

    it('should validate that the price is greater than 0', async () => {
        const res = await request(server).post('/api/products').send({
            name: "Monitor Test",
            price: 0
        })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(2)
    })
    
    it('should validate that the price is number and greater than 0', async () => {
        const res = await request(server).post('/api/products').send({
            name: "Monitor Test",
            price: "hola"
        })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(2)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(4)
    })

    it('should create a new product', async () => {
        const res = await request(server).post('/api/products').send({
            name: "Monitor Test",
            price: 200
        })
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toEqual(404)
        expect(res.status).not.toEqual(200)
        expect(res.status).not.toHaveProperty('errors')
    })
})

describe('GET /api/products', () => {

    it('should check if api/products url exists', async () => {
        const res = await request(server).get('/api/products')
        expect(res.status).not.toBe(404)
    })

    it('GET a JSON response with products', async () => {
        const res = await request(server).get('/api/products')
        expect(res.status).toBe(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toHaveLength(1)

        expect(res.status).not.toBe(404)
        expect(res.body).not.toHaveProperty('errors')

    })
})

describe('GET /api/products/:id', () => {
    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const res = await request(server).get(`/api/products/${productId}`)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe('Producto no encontrado')
    })

    it('Should check a valid ID in the URL', async () => {
        const res = await request(server).get('/api/products/not-valid-url')
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('ID no válido')
    })

    it('Get a JSON response for a single product', async () => {
        const res = await request(server).get('/api/products/1')
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {

    it('Should check a valid ID in the URL', async () => {
        const res = await request(server).put('/api/products/not-valid-url').send({
            name: "Monitor Nuevo",
            price: 200,
            availability: true
        })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('ID no válido')
    })

    it('Should display validation messages when updating a product', async () => {
        const res = await request(server).put('/api/products/1').send({})
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(5)

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('Should validate that price is grater than cero', async () => {
        const res = await request(server).put('/api/products/1').send({
            name: "Monitor Nuevo",
            price: 0,
            availability: true
        })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('Precio no válido')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const res = await request(server).put(`/api/products/${productId}`).send({
            name: "Monitor Nuevo",
            price: 300,
            availability: true
        })
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Producto no encontrado')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('Should update an existing product with valid data', async () => {
        const res = await request(server).put(`/api/products/1`).send({
            name: "Monitor Nuevo",
            price: 300,
            availability: true
        })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toBe(400)
        expect(res.body).not.toHaveProperty('errors')
    })
    
})

describe('PATCH /api/products/:id', () => {
    it('Should return a 404 response for a non-existing product', async () => {
        const productID = 2000
        const response = await request(server).patch(`/api/products/${productID}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')
        
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should update the product availability', async () => {
        const response = await request(server).patch('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.availability).toBe(false)
        
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('DELETE /api/products/:id', () => {
    it('Should check a valid ID', async () => {
        const res = await request(server).delete('/api/products/not-valid')
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors[0].msg).toBe('ID no válido')
    })

    it('Should return a 404 response for a non-existent product', async () => {
        const productID = 2000
        const res = await request(server).delete(`/api/products/${productID}`)
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Producto no encontrado')

        expect(res.status).not.toBe(200)
    })

    it('Should delete a product', async () => {
        const res = await request(server).delete(`/api/products/1`)
        expect(res.status).toBe(200)
        expect(res.body.data).toBe('Producto eliminado')

        expect(res.status).not.toBe(404)
    })
})

