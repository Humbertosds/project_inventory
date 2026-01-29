/**
 * Especificação OpenAPI 3.0 da API Estoque.
 * Documentação disponível em GET /api-docs
 */
export const openApiDocument = {
    openapi: '3.0.3',
    info: {
        title: 'API Estoque',
        description: 'API REST para gerenciamento de estoque - usuários, categorias, produtos, movimentações e dashboard.',
        version: '1.0.0',
    },
    servers: [
        {
            url: '/api',
            description: 'API base path',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Token obtido no endpoint POST /auth/login',
            },
        },
        schemas: {
            ApiResponse: {
                type: 'object',
                properties: {
                    error: { type: 'string', nullable: true },
                    data: { type: 'object', description: 'Dados da resposta' },
                },
            },
            LoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                },
            },
            LoginResponse: {
                type: 'object',
                properties: {
                    error: { type: 'string', nullable: true },
                    data: {
                        type: 'object',
                        properties: {
                            user: { $ref: '#/components/schemas/User' },
                            token: { type: 'string' },
                        },
                    },
                },
            },
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    avatar: { type: 'string', nullable: true },
                    isAdmin: { type: 'boolean' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
            RegisterUserRequest: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                    name: { type: 'string', minLength: 2, maxLength: 255 },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                },
            },
            UpdateUserRequest: {
                type: 'object',
                properties: {
                    name: { type: 'string', minLength: 2, maxLength: 255 },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                    avatar: { type: 'string', nullable: true },
                },
            },
            Category: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    productCount: { type: 'number', description: 'Apenas quando includeProductCount=true' },
                },
            },
            CreateCategoryRequest: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string', minLength: 2, maxLength: 255 },
                },
            },
            UpdateCategoryRequest: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string', minLength: 2, maxLength: 255 },
                },
            },
            Product: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    categoryId: { type: 'string', format: 'uuid' },
                    unitPrice: { type: 'integer' },
                    unitType: { type: 'string', enum: ['kg', 'g', 'l', 'ml', 'un'] },
                    quantity: { type: 'string' },
                    minimumQuantity: { type: 'string' },
                    maximumQuantity: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    category: { $ref: '#/components/schemas/Category', description: 'Objeto categoria quando disponível' },
                },
            },
            CreateProductRequest: {
                type: 'object',
                required: ['name', 'categoryId', 'unitPrice'],
                properties: {
                    name: { type: 'string', minLength: 2, maxLength: 255 },
                    categoryId: { type: 'string', format: 'uuid' },
                    unitPrice: { type: 'integer', minimum: 0 },
                    unitType: { type: 'string', enum: ['kg', 'g', 'l', 'ml', 'un'], default: 'un' },
                    quantity: { type: 'number', minimum: 0, default: 0 },
                    minimumQuantity: { type: 'number', minimum: 0, default: 0 },
                    maximumQuantity: { type: 'number', minimum: 0, default: 0 },
                },
            },
            UpdateProductRequest: {
                type: 'object',
                properties: {
                    name: { type: 'string', minLength: 2, maxLength: 255 },
                    categoryId: { type: 'string', format: 'uuid' },
                    unitPrice: { type: 'integer', minimum: 0 },
                    unitType: { type: 'string', enum: ['kg', 'g', 'l', 'ml', 'un'] },
                    quantity: { type: 'number', minimum: 0 },
                    minimumQuantity: { type: 'number', minimum: 0 },
                    maximumQuantity: { type: 'number', minimum: 0 },
                },
            },
            Move: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    productId: { type: 'string', format: 'uuid' },
                    userId: { type: 'string', format: 'uuid' },
                    type: { type: 'string', enum: ['in', 'out'] },
                    quantity: { type: 'string' },
                    unitPrice: { type: 'integer' },
                    createdAt: { type: 'string', format: 'date-time' },
                    product: { $ref: '#/components/schemas/Product' },
                },
            },
            AddMoveRequest: {
                type: 'object',
                required: ['productId', 'type', 'quantity'],
                properties: {
                    productId: { type: 'string', format: 'uuid' },
                    type: { type: 'string', enum: ['in', 'out'] },
                    quantity: { type: 'number', minimum: 1 },
                },
            },
            Error: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                },
            },
        },
    },
    paths: {
        '/ping': {
            get: {
                summary: 'Health check',
                description: 'Verifica se a API está respondendo.',
                tags: ['Health'],
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { pong: { type: 'boolean' } },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/auth/login': {
            post: {
                summary: 'Login',
                description: 'Autentica o usuário e retorna token.',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LoginRequest' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Login realizado com sucesso',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/LoginResponse' },
                            },
                        },
                    },
                    '401': {
                        description: 'Credenciais inválidas',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/auth/logout': {
            post: {
                summary: 'Logout',
                description: 'Invalida o token (opcional: enviar header Authorization).',
                tags: ['Auth'],
                security: [],
                responses: {
                    '200': {
                        description: 'Logout realizado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: {
                                            type: 'object',
                                            properties: { message: { type: 'string' } },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/auth/me': {
            get: {
                summary: 'Usuário autenticado',
                description: 'Retorna os dados do usuário logado.',
                tags: ['Auth'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Dados do usuário',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: { $ref: '#/components/schemas/User' },
                                    },
                                },
                            },
                        },
                    },
                    '401': {
                        description: 'Não autorizado',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/users': {
            get: {
                summary: 'Listar usuários',
                description: 'Lista usuários com paginação.',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'offset', in: 'query', schema: { type: 'integer', minimum: 0, default: 0 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 } },
                ],
                responses: {
                    '200': {
                        description: 'Lista de usuários',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/User' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                summary: 'Criar usuário',
                description: 'Registra um novo usuário.',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RegisterUserRequest' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Usuário criado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: { $ref: '#/components/schemas/User' },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Dados inválidos',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/users/{id}': {
            get: {
                summary: 'Buscar usuário por ID',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                ],
                responses: {
                    '200': {
                        description: 'Usuário encontrado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: { $ref: '#/components/schemas/User' },
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Usuário não encontrado',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
            put: {
                summary: 'Atualizar usuário',
                description: 'Atualiza usuário por ID. Pode enviar multipart/form-data com avatar (imagem).',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/UpdateUserRequest' },
                        },
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string' },
                                    avatar: { type: 'string', format: 'binary' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Usuário atualizado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: { $ref: '#/components/schemas/User' },
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Usuário não encontrado',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
            delete: {
                summary: 'Excluir usuário',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                ],
                responses: {
                    '204': { description: 'Usuário excluído' },
                    '404': {
                        description: 'Usuário não encontrado',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/categories': {
            get: {
                summary: 'Listar categorias',
                description: 'Lista categorias. Use includeProductCount=true para incluir quantidade de produtos.',
                tags: ['Categories'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'includeProductCount',
                        in: 'query',
                        schema: { type: 'boolean', default: false },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de categorias',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Category' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                summary: 'Criar categoria',
                tags: ['Categories'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CreateCategoryRequest' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Categoria criada',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: { $ref: '#/components/schemas/Category' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/categories/{id}': {
            get: {
                summary: 'Buscar categoria por ID',
                tags: ['Categories'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                ],
                responses: {
                    '200': {
                        description: 'Categoria encontrada',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: { $ref: '#/components/schemas/Category' },
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Categoria não encontrada',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
            put: {
                summary: 'Atualizar categoria',
                tags: ['Categories'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/UpdateCategoryRequest' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Categoria atualizada',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: { $ref: '#/components/schemas/Category' },
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Categoria não encontrada',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
            delete: {
                summary: 'Excluir categoria',
                tags: ['Categories'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                ],
                responses: {
                    '204': { description: 'Categoria excluída' },
                    '404': {
                        description: 'Categoria não encontrada',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/products': {
            get: {
                summary: 'Listar produtos',
                description: 'Lista produtos com paginação e busca por nome.',
                tags: ['Products'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'offset', in: 'query', schema: { type: 'integer', minimum: 0, default: 0 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 30, default: 10 } },
                    { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Busca por nome' },
                ],
                responses: {
                    '200': {
                        description: 'Lista de produtos',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Product' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                summary: 'Criar produto',
                tags: ['Products'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CreateProductRequest' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Produto criado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: { $ref: '#/components/schemas/Product' },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Dados inválidos',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/products/{id}': {
            get: {
                summary: 'Buscar produto por ID',
                tags: ['Products'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                ],
                responses: {
                    '200': {
                        description: 'Produto encontrado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: { $ref: '#/components/schemas/Product' },
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Produto não encontrado',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
            put: {
                summary: 'Atualizar produto',
                tags: ['Products'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/UpdateProductRequest' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Produto atualizado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: { $ref: '#/components/schemas/Product' },
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Produto não encontrado',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
            delete: {
                summary: 'Excluir produto',
                tags: ['Products'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                ],
                responses: {
                    '204': { description: 'Produto excluído' },
                    '404': {
                        description: 'Produto não encontrado',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/moves': {
            get: {
                summary: 'Listar movimentações',
                description: 'Lista movimentações com paginação. Filtro opcional por productId.',
                tags: ['Moves'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'productId', in: 'query', schema: { type: 'string', format: 'uuid' } },
                    { name: 'offset', in: 'query', schema: { type: 'integer', minimum: 0, default: 0 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 } },
                ],
                responses: {
                    '200': {
                        description: 'Lista de movimentações',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Move' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                summary: 'Registrar movimentação',
                description: 'Cria entrada (in) ou saída (out) de estoque para um produto.',
                tags: ['Moves'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/AddMoveRequest' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Movimentação registrada',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: { $ref: '#/components/schemas/Move' },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Dados inválidos ou estoque insuficiente (para saída)',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/dashboard/inventory-value': {
            get: {
                summary: 'Valor do inventário',
                description: 'Retorna o valor total do estoque.',
                tags: ['Dashboard'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Valor total do inventário',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                totalValue: { type: 'number' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/dashboard/moves-summary': {
            get: {
                summary: 'Resumo de movimentações',
                description: 'Total e quantidade de entradas e saídas em um período (startDate/endDate em ISO).',
                tags: ['Dashboard'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
                    { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
                ],
                responses: {
                    '200': {
                        description: 'Resumo de movimentações',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                totalIn: { type: 'number' },
                                                totalOut: { type: 'number' },
                                                countIn: { type: 'integer' },
                                                countOut: { type: 'integer' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/dashboard/moves-graph': {
            get: {
                summary: 'Dados para gráfico de movimentações',
                description: 'Dados de saídas (OUT) para exibição em gráfico.',
                tags: ['Dashboard'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
                    { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
                ],
                responses: {
                    '200': {
                        description: 'Dados para gráfico',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: { type: 'array', items: { type: 'object' } },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/dashboard/low-stock': {
            get: {
                summary: 'Produtos com estoque baixo',
                description: 'Produtos cuja quantidade está abaixo do mínimo.',
                tags: ['Dashboard'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Lista de produtos com estoque baixo',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Product' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/dashboard/high-stock': {
            get: {
                summary: 'Produtos com estoque alto',
                description: 'Produtos cuja quantidade está acima do máximo.',
                tags: ['Dashboard'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Lista de produtos com estoque alto',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Product' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/dashboard/stagnant-products': {
            get: {
                summary: 'Produtos estagnados',
                description: 'Produtos que não tiveram saídas (OUT) em um determinado período.',
                tags: ['Dashboard'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
                    { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
                ],
                responses: {
                    '200': {
                        description: 'Lista de produtos estagnados',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', nullable: true },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Product' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
