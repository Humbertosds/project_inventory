import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { moves, NewMove, products } from "../db/schema";
import { AppError } from "../utils/appError";

export const addMove = async (data: Omit<NewMove, 'unitPrice'>) => {
    // 1. Verificar existencia do product, pegar quantity e unitPrice;
    // 2. Se for um move OUT, verificar quantity do product, nao da pra tirar mais do que tem;
    // 3. Inserir o move no banco;
    // 4. Atualizar quantity do product;

    return await db.transaction(async (tx) => {
        const productResults = await tx
            .select({
                quantity: products.quantity,
                unitPrice: products.unitPrice
            })
            .from(products)
            .where(eq(products.id, data.productId))
            .for('update');

        if (productResults.length === 0) {
            throw new AppError('Product not found', 404);
        }

        const currentQty = parseFloat(productResults[0].quantity);
        const moveQty = parseFloat(data.quantity);

        if (data.type === 'out') {
            if (currentQty < moveQty) {
                throw new AppError(`Invalid quantity. current: ${currentQty}, movimentation: ${moveQty}`)
            }
        }

        const unitPrice = productResults[0].unitPrice;

        const result = await tx
            .insert(moves)
            .values({ ...data, unitPrice })
            .returning();

        const move = result[0];

        const newQty = data.type === 'in' ? currentQty + moveQty : currentQty - moveQty;

        await tx
            .update(products)
            .set({ quantity: newQty.toString(), updatedAt: new Date() })
            .where(eq(products.id, data.productId))

        return move;
    })
}
