const Mutations = {
    async createItem(parent, args, ctx, info) {
        //To DO if logged in
        const item = await ctx.db.mutation.createItem({
            data: {
                ...args,
            }
        }, info);

        return item;
    },
    async updateItem(parent, args, ctx, info) {
        // first take a copy of the updates
        const updates = { ...args };
        // remove ID from the updates
        delete updates.id;
        // run the update method
        return ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
    },
    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id };
        // find the item
        const item = await ctx.db.query.item({ where }, `{ id, title }`)
        // check if they own that item, or have the permission

        // delete it
        console.log('deleting ...')
        return ctx.db.mutation.deleteItem({ where }, info)
    }
};

module.exports = Mutations;
