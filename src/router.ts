import {Router} from 'express'
import {body, param} from 'express-validator'
import { createProduct, getProducts, getProductById, updateProduct, updateAvailability, deleteProduct } from './handlers/product'
import { handleInputErrors } from './middleware'

const router = Router()

/**
 * @swagger
 * components:
 *  schemas:
 *      Product:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The Product ID
 *                  example: 1
 *              name:
 *                  type: string
 *                  description: The Product name
 *                  example: Monitor Curvo de 49 pulgadas
 *              price:
 *                  type: number
 *                  description: The Product price
 *                  example: 300
 *              availability:
 *                  type: boolean
 *                  description: The Product availability
 *                  example: true
 */


/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Succesful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Product'
 */

//Routing
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a product by id
 *      tags:
 *          - Products
 *      description: Return a product based on its unique ID
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Succesful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Product not found
 *          404:
 *              description: Invalid ID
*/

router.get('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    getProductById
)

/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Creates a new product
 *      tags:
 *          - Products
 *      description: Returns a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor Curso 49 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 300
 *      responses:
 *          201:
 *               description: Sucessful response
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid input data
 */

router.post('/', 
    //comienzo de la validacion
    body('name')
        .notEmpty().withMessage('El nombre del producto no puede ir vacío'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio del producto no puede ir vacío')
        .custom(value => value > 0).withMessage('Precio no válido'),
    //middleware de error
    handleInputErrors,
    //llamado del handler
    createProduct
)

/**
* @swagger
* /api/products/{id}:
*  put:
*       summary: Updates a product with user input
*       tags:
*           - Products
*       description: Returns the updated product
*       parameters:
*        - in: path
*          name: id
*          description: The ID of the product to retrieve
*          required: true
*          schema:
*              type: integer
*       requestBody:
*          required: true
*          content:
*              application/json:
*                  schema:
*                      type: object
*                      properties:
*                          name:
*                              type: string
*                              example: "Monitor Curso 49 pulgadas"
*                          price:
*                              type: number
*                              example: 300
*                          availability:
*                              type: boolean
*                              example: true
*       responses:
*           200:
*               description: Sucessful response
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Product'
*           404:
*               description: Product not found
*           400:
*               description: Bad Request - Invalid ID or Invalid input data  
*/

router.put('/:id', 
    //comienzo de la validacion
    param('id').isInt().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El nombre del producto no puede ir vacío'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio del producto no puede ir vacío')
        .custom(value => value > 0).withMessage('Precio no válido'),
    body('availability')
        .isBoolean().withMessage('Valor para disponibilidad no válido'),
    //middleware de error
    handleInputErrors,
    updateProduct
)

/**
* @swagger
* /api/products/{id}:
*  patch:
*       summary: Update Product availability
*       tags:
*           - Products
*       description: Returns the updated availability
*       parameters:
*        - in: path
*          name: id
*          description: The ID of the product to retrieve
*          required: true
*          schema:
*              type: integer
*       responses:
*           200:
*               description: Sucessful response
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Product'
*           404:
*               description: Product not found
*           400:
*               description: Bad Request - Invalid ID
*/

router.patch('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    updateAvailability
)

/**
* @swagger
* /api/products/{id}:
*  delete:
*       summary: Deletes a Product by a given ID
*       tags:
*           - Products
*       description: Returns a confirmation message
*       parameters:
*        - in: path
*          name: id
*          description: The ID of the product to retrieve
*          required: true
*          schema:
*              type: integer
*       responses:
*           200:
*               description: Sucessful response
*               content:
*                   application/json:
*                       schema:
*                           type: string
*                           value: "Produto eliminado"
*           404:
*               description: Product not found
*           400:
*               description: Bad Request - Invalid ID
*/

router.delete('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    deleteProduct
)

export default router