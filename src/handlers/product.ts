import { Request, Response} from 'express'
import Product from '../models/Product.model'

//para conocer los status que hay que usar está esta página ===> https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

export const getProducts = async (req: Request, res: Response) => {
    //Obtener todos los productos
    try {
        const products = await Product.findAll({
            order: [
                ['id', 'ASC']
            ]
        })
        res.json({data: products})
    } catch (error) {
        console.log(error)
    }
}

export const getProductById = async (req: Request, res: Response) => {
    //Obtener un producto por su id
    try {
        const {id} = req.params
        const product = await Product.findByPk(id)
        if(!product){
            return res.status(404).json({
                'error': 'Producto no encontrado'
            })
        }
        res.json({data: product})
    } catch (error) {
        console.log(error)
    }
}

export const createProduct = async (req: Request, res: Response) => {
    //Asignar nuevo producto a la db
    try {
        const product = await Product.create(req.body)
        res.status(201).json({data: product})
    } catch (error) {
        console.log(error)
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    //consultar primero si existe el producto
    const {id} = req.params
    const product = await Product.findByPk(id)
    if(!product){
        return res.status(404).json({
            'error': 'Producto no encontrado'
        })
    }
    //proceder a actualizar el producto
    await product.update(req.body)
    await product.save()
    res.json({data: product})
}

export const updateAvailability = async (req: Request, res: Response) => {
    //consultar primero si existe el producto
    const {id} = req.params
    const product = await Product.findByPk(id)
    if(!product){
        return res.status(404).json({
            'error': 'Producto no encontrado'
        })
    }
    //proceder a actualizar la disponibilidad
    product.availability = !product.dataValues.availability
    await product.save()
    res.json({data: product})
}

export const deleteProduct = async (req: Request, res: Response) => {
    //consultar primero si existe el producto
    const {id} = req.params
    const product = await Product.findByPk(id)
    if(!product){
        return res.status(404).json({
            'error': 'Producto no encontrado'
        })
    }
    await product.destroy()
    res.json({data: 'Producto eliminado'})
}